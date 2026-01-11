"use client";

import { useState, useEffect, useRef, useCallback } from "react";

import { streamChat } from "@/lib/api-client";

import { API_CONFIG } from "@/lib/config";

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

export default function useStateAiAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<MessageAi[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported] = useState(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      return !!SpeechRecognition;
    }
    return false;
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const transcriptRef = useRef<string>("");
  const isRestartingRef = useRef<boolean>(false);
  const lastCheckedMessageIdRef = useRef<string>("");
  const audioContextRef = useRef<AudioContext | null>(null);
  const isListeningRef = useRef<boolean>(false); // Hanya untuk callback, sync dengan state
  const messageInputRef = useRef<string>(""); // Hanya untuk callback, sync dengan state

  useEffect(() => {
    if (typeof window !== "undefined" && isSpeechSupported) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition && !recognitionRef.current) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "id-ID";

        recognition.onstart = () => {
          setIsListening(true);
          isListeningRef.current = true;
          transcriptRef.current = messageInputRef.current || "";
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          if (!isListeningRef.current) return;

          let interimTranscript = "";
          let finalTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            const transcript = result[0]?.transcript || "";
            if (result.isFinal) {
              finalTranscript += transcript + " ";
            } else {
              interimTranscript += transcript;
            }
          }

          if (!finalTranscript && !interimTranscript) {
            return;
          }

          let baseText = transcriptRef.current;

          if (finalTranscript) {
            baseText = transcriptRef.current + finalTranscript;
            transcriptRef.current = baseText;
          }

          const displayText = baseText + interimTranscript;

          setMessageInput(displayText);

          setTimeout(() => {
            if (textareaRef.current) {
              const newPosition = displayText.length;
              textareaRef.current.setSelectionRange(newPosition, newPosition);
              textareaRef.current.style.height = "auto";
              textareaRef.current.style.height = `${Math.min(
                textareaRef.current.scrollHeight,
                120
              )}px`;
            }
          }, 0);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error("Speech recognition error:", event.error);
          if (event.error === "no-speech") {
            return;
          }

          if (
            event.error === "audio-capture" ||
            event.error === "not-allowed"
          ) {
            setIsListening(false);
            isListeningRef.current = false;
            alert(
              "Akses mikrofon ditolak. Silakan izinkan akses mikrofon untuk menggunakan fitur voice-to-text."
            );
          }
        };

        recognition.onend = () => {
          if (!isListeningRef.current) {
            setIsListening(false);
            isRestartingRef.current = false;
            return;
          }

          if (isRestartingRef.current) {
            return;
          }

          isRestartingRef.current = true;

          requestAnimationFrame(() => {
            setTimeout(() => {
              if (!isListeningRef.current || !recognitionRef.current) {
                isRestartingRef.current = false;
                return;
              }

              try {
                recognitionRef.current.start();
                isRestartingRef.current = false;
              } catch (error) {
                const errorMessage =
                  error instanceof Error ? error.message : String(error);
                if (
                  errorMessage.includes("already started") ||
                  errorMessage.includes("started")
                ) {
                  isRestartingRef.current = false;
                  return;
                }

                console.log("Recognition restart failed, retrying...", error);
                setTimeout(() => {
                  if (isListeningRef.current && recognitionRef.current) {
                    try {
                      recognitionRef.current.start();
                      isRestartingRef.current = false;
                    } catch (retryError) {
                      console.log(
                        "Recognition restart failed after retry",
                        retryError
                      );
                      setIsListening(false);
                      isListeningRef.current = false;
                      isRestartingRef.current = false;
                    }
                  } else {
                    isRestartingRef.current = false;
                  }
                }, 200);
              }
            }, 1);
          });
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current && isListeningRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, [isSpeechSupported]);

  // Sync state dengan ref untuk callback
  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    messageInputRef.current = messageInput;
  }, [messageInput]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Fungsi untuk mengaktifkan audio context (digunakan bersama)
  const enableAudio = useCallback(async () => {
    if (typeof window === "undefined") return;

    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextClass();
    }

    const currentState = audioContextRef.current.state;
    if (currentState === "suspended") {
      try {
        await audioContextRef.current.resume();
        let retries = 0;
        while (audioContextRef.current.state !== "running" && retries < 10) {
          await new Promise((resolve) => setTimeout(resolve, 50));
          retries++;
        }
      } catch (error) {
        console.error("Error enabling audio context:", error);
      }
    }
  }, []);

  // Aktifkan audio context saat user pertama kali berinteraksi atau saat chat dibuka
  useEffect(() => {
    // Aktifkan saat chat window dibuka
    if (isOpen) {
      enableAudio();
    }

    // Aktifkan saat user klik pertama kali
    const handleUserInteraction = async () => {
      await enableAudio();
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    };

    document.addEventListener("click", handleUserInteraction, { once: true });
    document.addEventListener("touchstart", handleUserInteraction, {
      once: true,
    });

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    };
  }, [isOpen, enableAudio]);

  // Fungsi untuk memutar suara notifikasi
  const playNotificationSound = useCallback(async () => {
    try {
      await enableAudio();

      if (
        !audioContextRef.current ||
        audioContextRef.current.state !== "running"
      ) {
        return;
      }

      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.6, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContextRef.current.currentTime + 0.3
      );

      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + 0.3);

      oscillator.onended = () => {
        oscillator.disconnect();
        gainNode.disconnect();
      };
    } catch (error) {
      console.error("Error playing notification sound:", error);
    }
  }, [enableAudio]);

  // Deteksi pesan baru dari admin dan putar suara notifikasi
  useEffect(() => {
    if (messages.length === 0) {
      lastCheckedMessageIdRef.current = "";
      return;
    }

    // Cari pesan terakhir dari admin
    const adminMessages = messages.filter((msg) => msg.sender === "admin");
    if (adminMessages.length === 0) {
      return;
    }

    const lastAdminMessage = adminMessages[adminMessages.length - 1];

    // Jika ini adalah pesan admin baru yang belum dicek
    if (lastAdminMessage.id !== lastCheckedMessageIdRef.current) {
      console.log("Pesan admin baru terdeteksi:", lastAdminMessage);
      lastCheckedMessageIdRef.current = lastAdminMessage.id;

      // Putar suara notifikasi
      // Gunakan setTimeout kecil untuk memastikan audio context siap
      setTimeout(() => {
        playNotificationSound().catch((error) => {
          console.error("Failed to play notification sound:", error);
        });
      }, 100);
    }
  }, [messages, playNotificationSound]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        if (showEmojiPicker) {
          setShowEmojiPicker(false);
        } else {
          setIsOpen(false);
        }
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, setIsOpen, showEmojiPicker]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest(
          '[aria-label*="emoji" i], [aria-label*="Emoji" i], button[class*="emoji"]'
        )
      ) {
        setShowEmojiPicker(false);
      }
    };
    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showEmojiPicker]);

  useEffect(() => {
    type MinimalLenis = { stop?: () => void; start?: () => void };
    const lenis: MinimalLenis | undefined =
      typeof window !== "undefined"
        ? (window as unknown as { lenis?: MinimalLenis }).lenis
        : undefined;

    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (lenis?.stop) lenis.stop();
    } else {
      document.body.style.overflow = "unset";
      if (lenis?.start) lenis.start();
    }

    return () => {
      document.body.style.overflow = "unset";
      if (lenis?.start) lenis.start();
    };
  }, [isOpen]);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const generateMessageId = () => {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const isProductRelated = (message: string): boolean => {
    const productKeywords = [
      "product",
      "produk",
      "barang",
      "item",
      "beli",
      "buy",
      "purchase",
      "harga",
      "price",
      "kategori",
      "category",
      "jenis",
      "type",
      "tag",
      "framework",
      "discount",
      "diskon",
      "popular",
      "terlaris",
      "rating",
      "ulasan",
      "stock",
      "stok",
      "sold",
      "terjual",
      "apa saja",
      "list",
      "daftar",
      "tampilkan",
      "show",
    ];
    const lowerMessage = message.toLowerCase();
    return productKeywords.some((keyword) => lowerMessage.includes(keyword));
  };

  const isContactRelated = (message: string): boolean => {
    const contactKeywords = [
      "kontak",
      "contact",
      "nomor",
      "nomber",
      "number",
      "telepon",
      "phone",
      "whatsapp",
      "wa",
      "hubungi",
      "call",
      "call me",
      "custom website",
      "website custom",
      "pesan website",
      "order website",
      "jasa website",
      "buat website",
      "bikin website",
      "pembuatan website",
    ];

    const detailContactKeywords = [
      "nomor",
      "nomber",
      "number",
      "kontak",
      "contact",
      "whatsapp",
      "wa",
      "telepon",
      "phone",
      "hubungi",
      "call",
    ];

    const detailKeywords = [
      "detail",
      "details",
      "lebih detail",
      "lebih lanjut",
      "info lebih",
      "informasi lebih",
      "tanya lebih",
      "bertanya lebih",
      "detail lebih",
      "untuk detail",
      "untuk lebih",
      "detailnya",
      "infonya",
    ];

    const lowerMessage = message.toLowerCase();

    const hasContactKeyword = contactKeywords.some((keyword) =>
      lowerMessage.includes(keyword)
    );

    const asksForContactForDetails = detailContactKeywords.some(
      (contactKey) =>
        lowerMessage.includes(contactKey) &&
        detailKeywords.some((detailKey) => lowerMessage.includes(detailKey))
    );

    const asksForNumber =
      /(ada|punya|tersedia|ada tidak|ada nggak|ada ga).*(nomor|nomber|kontak|whatsapp|wa|telepon|phone)/i.test(
        message
      );

    return hasContactKeyword || asksForContactForDetails || asksForNumber;
  };

  const fetchProductsData = async (): Promise<{
    context: string;
    products: Product[];
  }> => {
    try {
      const response = await fetch(API_CONFIG.ENDPOINTS.products.base, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_CONFIG.SECRET}`,
        },
      });

      if (!response.ok) {
        return { context: "", products: [] };
      }

      const data = await response.json();
      const products = Array.isArray(data) ? data : data?.data || [];

      if (products.length === 0) {
        return { context: "", products: [] };
      }

      const limitedProducts = products.slice(0, 20);
      const productsContext = limitedProducts
        .map((product: Product) => {
          return `- ${product.title || "N/A"} (ID: ${
            product.productsId || product._id || "N/A"
          })
  Harga: ${product.price || 0}
  Kategori: ${product.category?.title || "N/A"}
  Tipe: ${product.type?.title || "N/A"}
  Status: ${product.status || "N/A"}
  Stock: ${product.stock || 0}
  Terjual: ${product.sold || 0}
  Rating: ${product.ratingAverage || 0} (${product.ratingCount || 0} ulasan)
  ${
    product.discount && product.discount.value !== undefined
      ? `Diskon: ${
          product.discount.type === "percentage"
            ? product.discount.value + "%"
            : product.discount.value
        }`
      : ""
  }
  ${
    product.description
      ? `Deskripsi: ${product.description.substring(0, 100)}...`
      : ""
  }`;
        })
        .join("\n\n");

      const formattedProducts: Product[] = limitedProducts.map(
        (product: {
          _id?: string;
          productsId?: string;
          title?: string;
          thumbnail?: string;
          price?: number;
          category?: { title?: string };
          type?: { title?: string };
          status?: string;
          stock?: number;
          sold?: number;
          ratingAverage?: number;
          ratingCount?: number;
          discount?: { type?: string; value?: number };
          description?: string;
        }) => ({
          _id: product._id,
          productsId: product.productsId,
          title: product.title || "N/A",
          thumbnail: product.thumbnail || "",
          price: product.price || 0,
          category: product.category,
          type: product.type,
          status: product.status,
          stock: product.stock,
          sold: product.sold,
          ratingAverage: product.ratingAverage,
          ratingCount: product.ratingCount,
          discount: product.discount,
          description: product.description,
        })
      );

      return {
        context: `Berikut adalah data produk yang tersedia:\n\n${productsContext}\n\nGunakan informasi ini untuk menjawab pertanyaan user tentang produk.`,
        products: formattedProducts,
      };
    } catch (error) {
      console.error("Error fetching products:", error);
      return { context: "", products: [] };
    }
  };

  const handleSendMessage = async () => {
    const userMessage = messageInput.trim();
    if (!userMessage || isLoading) return;

    const userMsg: MessageAi = {
      id: generateMessageId(),
      sender: "user",
      content: userMessage,
      timestamp: getCurrentTime(),
      read: true,
    };

    setMessages((prev) => [...prev, userMsg]);
    setMessageInput("");
    setShowEmojiPicker(false);
    // Stop listening if active
    if (isListening) {
      stopListening();
    }
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setIsTyping(true);
    setIsLoading(true);

    // Create AI message ID for later use
    const aiMsgId = generateMessageId();

    try {
      // Check if user is asking about products
      let productsContext = "";
      let productsData: Product[] = [];

      if (isProductRelated(userMessage)) {
        const result = await fetchProductsData();
        productsContext = result.context;
        productsData = result.products;
      }

      // Check if user is asking about contact/custom website
      let contactContext = "";
      if (isContactRelated(userMessage)) {
        contactContext = `Informasi Kontak untuk Jelajah Kode:
- Nomor WhatsApp: 085811668557
- Nama: Jelajah Kode
- Layanan: Custom Website Development dan berbagai layanan lainnya

Jika user bertanya tentang kontak, nomor telepon, WhatsApp, atau meminta nomor untuk detail/informasi lebih lanjut, berikan informasi kontak di atas dengan format yang ramah dan jelas. 

Contoh pertanyaan yang harus diberikan nomor:
- "apa ada nomor yang tersedia untuk lebih details?"
- "ada nomor yang bisa dihubungi?"
- "nomor untuk detail lebih lanjut"
- "kontak untuk informasi lebih"
- "whatsapp untuk tanya lebih detail"

Berikan nomor WhatsApp (085811668557) dengan format yang jelas dan ramah.`;
      }

      // Prepare conversation history for AI
      const conversationHistory: Array<{
        sender: "user" | "assistant" | "admin";
        content: string;
      }> = messages.map((msg) => ({
        sender: msg.sender,
        content: msg.content,
      }));

      // Add system context for first message
      let systemContext = "";
      if (messages.length === 0) {
        systemContext = `Anda adalah AI Assistant dari **Jelajah Kode**. Saat user pertama kali mengirim pesan, sambut mereka dengan ramah menggunakan pesan berikut:
"Halo! 👋 Selamat datang di **Jelajah Kode**!

Apa kabar? Kami dengan senang hati siap membantu Anda. Apa yang ingin Anda tanyakan?"

Jangan tampilkan nomor WhatsApp atau informasi kontak kecuali user secara eksplisit bertanya tentang kontak, nomor telepon, WhatsApp, atau meminta nomor untuk detail/informasi lebih lanjut.`;
      }

      // Combine contexts and user message
      let finalUserMessage = userMessage;
      const allContexts = [
        systemContext,
        productsContext,
        contactContext,
      ].filter(Boolean);
      if (allContexts.length > 0) {
        finalUserMessage = `${allContexts.join(
          "\n\n"
        )}\n\nPertanyaan user: ${userMessage}`;
      }

      conversationHistory.push({
        sender: "user",
        content: finalUserMessage,
      });

      // Transform conversationHistory to Message[] format
      const messagesForStream: Message[] = conversationHistory
        .filter((msg) => msg.sender !== "admin") // Filter out admin messages
        .map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.content,
        }));

      await streamChat({
        endpoint: API_CONFIG.ENDPOINTS.chat.curhat,
        messages: messagesForStream,
        onChunk: (content) => {
          setMessages((prev) => {
            // Check if AI message already exists
            const existingMsg = prev.find((msg) => msg.id === aiMsgId);
            if (existingMsg) {
              // Update existing message
              return prev.map((msg) =>
                msg.id === aiMsgId
                  ? {
                      ...msg,
                      content,
                      products:
                        productsData.length > 0 ? productsData : msg.products,
                    }
                  : msg
              );
            } else {
              // Create new AI message when first chunk arrives
              const aiMsg: MessageAi = {
                id: aiMsgId,
                sender: "assistant",
                content,
                timestamp: getCurrentTime(),
                read: false,
                products: productsData.length > 0 ? productsData : undefined,
              };
              return [...prev, aiMsg];
            }
          });
        },
        onError: (error) => {
          console.error("Chat error:", error);
          // Create or update AI message with error
          setMessages((prev) => {
            const existingMsg = prev.find((msg) => msg.id === aiMsgId);
            if (existingMsg) {
              return prev.map((msg) =>
                msg.id === aiMsgId
                  ? { ...msg, content: `Maaf, terjadi kesalahan: ${error}` }
                  : msg
              );
            } else {
              const aiMsg: MessageAi = {
                id: aiMsgId,
                sender: "assistant",
                content: `Maaf, terjadi kesalahan: ${error}`,
                timestamp: getCurrentTime(),
                read: false,
              };
              return [...prev, aiMsg];
            }
          });
          setIsTyping(false);
          setIsLoading(false);
        },
      });

      // Ensure products are displayed after streaming completes
      if (productsData.length > 0) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMsgId ? { ...msg, products: productsData } : msg
          )
        );
      }

      setIsTyping(false);
      setIsLoading(false);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev: MessageAi[]) => {
        const existingMsg = prev.find((msg) => msg.id === aiMsgId);
        if (existingMsg) {
          return prev.map((msg) =>
            msg.id === aiMsgId
              ? {
                  ...msg,
                  content: "Maaf, terjadi kesalahan. Silakan coba lagi.",
                }
              : msg
          );
        } else {
          const aiMsg: MessageAi = {
            id: aiMsgId,
            sender: "assistant",
            content: "Maaf, terjadi kesalahan. Silakan coba lagi.",
            timestamp: getCurrentTime(),
            read: false,
          };
          return [...prev, aiMsg];
        }
      });
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    const cursorPosition =
      textareaRef.current?.selectionStart || messageInput.length;
    const textBefore = messageInput.substring(0, cursorPosition);
    const textAfter = messageInput.substring(cursorPosition);
    setMessageInput(textBefore + emojiObject.emoji + textAfter);
    setShowEmojiPicker(false);
    // Focus back to textarea and set cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newPosition = cursorPosition + emojiObject.emoji.length;
        textareaRef.current.setSelectionRange(newPosition, newPosition);
        // Auto resize textarea
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${Math.min(
          textareaRef.current.scrollHeight,
          120
        )}px`;
      }
    }, 0);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        transcriptRef.current = messageInput;
        isRestartingRef.current = false;
        isListeningRef.current = true;
        recognitionRef.current.start();
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        setIsListening(false);
        isListeningRef.current = false;
      }
    }
  };

  const stopListening = () => {
    isRestartingRef.current = false;
    isListeningRef.current = false;
    setIsListening(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error("Error stopping speech recognition:", error);
      }
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return {
    isOpen,
    setIsOpen,
    messageInput,
    setMessageInput,
    isTyping,
    messages,
    isLoading,
    messagesEndRef,
    textareaRef,
    handleSendMessage,
    showEmojiPicker,
    setShowEmojiPicker,
    handleEmojiClick,
    toggleEmojiPicker,
    emojiPickerRef,
    isListening,
    isSpeechSupported,
    toggleListening,
    stopListening,
    enableAudio,
  };
}
