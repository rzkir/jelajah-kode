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

const STORAGE_KEYS = {
  MESSAGES: "ai-agent-messages",
  LAST_RESET: "ai-agent-last-reset",
};

const ONE_DAY_MS = 24 * 60 * 60 * 1000; // 1 hari dalam milliseconds

// Fungsi helper untuk memuat messages dari localStorage
const loadMessagesFromStorage = (): MessageAi[] => {
  if (typeof window === "undefined") return [];

  try {
    const storedMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    const lastReset = localStorage.getItem(STORAGE_KEYS.LAST_RESET);

    if (!storedMessages || !lastReset) {
      // Jika tidak ada data, set timestamp sekarang
      localStorage.setItem(STORAGE_KEYS.LAST_RESET, Date.now().toString());
      return [];
    }

    const lastResetTime = parseInt(lastReset, 10);
    const now = Date.now();
    const timeDiff = now - lastResetTime;

    // Jika sudah lebih dari 1 hari, reset messages
    if (timeDiff >= ONE_DAY_MS) {
      localStorage.removeItem(STORAGE_KEYS.MESSAGES);
      localStorage.setItem(STORAGE_KEYS.LAST_RESET, now.toString());
      return [];
    }

    // Load messages dari storage
    const parsedMessages = JSON.parse(storedMessages);
    return Array.isArray(parsedMessages) ? parsedMessages : [];
  } catch (error) {
    console.error("Error loading messages from storage:", error);
    return [];
  }
};

export default function useStateAiAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Initialize messages dari localStorage dengan lazy initialization
  const [messages, setMessages] = useState<MessageAi[]>(
    loadMessagesFromStorage
  );
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
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const transcriptRef = useRef<string>("");
  const isRestartingRef = useRef<boolean>(false);
  const lastCheckedMessageIdRef = useRef<string>("");
  const audioContextRef = useRef<AudioContext | null>(null);
  const isUserScrollingRef = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Simpan messages ke localStorage setiap kali messages berubah
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    } catch (error) {
      console.error("Error saving messages to storage:", error);
    }
  }, [messages]);

  // Store current values in refs for callbacks
  const isListeningRef = useRef(isListening);
  const messageInputRef = useRef(messageInput);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    messageInputRef.current = messageInput;
  }, [messageInput]);

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

  // Helper function to check if user is near bottom of scroll container
  const isNearBottom = useCallback(
    (container: HTMLElement, threshold = 100) => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      return scrollHeight - scrollTop - clientHeight < threshold;
    },
    []
  );

  // Auto-scroll when messages change or when typing
  useEffect(() => {
    if (!messagesContainerRef.current || !messagesEndRef.current) {
      return;
    }

    // If user is manually scrolling, don't auto-scroll
    if (isUserScrollingRef.current) {
      return;
    }

    // Always scroll to bottom when new message is added (user or assistant)
    // Check if user is near bottom before auto-scrolling
    const container = messagesContainerRef.current;
    const isNear = isNearBottom(container, 150); // Increase threshold slightly

    if (isNear) {
      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (messagesEndRef.current && !isUserScrollingRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
          }
        }, 50);
      });
    }
  }, [messages, isLoading, isNearBottom]);

  // Force scroll to bottom when streaming (isLoading is true)
  useEffect(() => {
    if (
      !isLoading ||
      !messagesContainerRef.current ||
      !messagesEndRef.current
    ) {
      return;
    }

    // When assistant is typing/streaming, always scroll to bottom
    if (!isUserScrollingRef.current) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (messagesEndRef.current && !isUserScrollingRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      });
    }
  }, [isLoading]);

  // Scroll to bottom when chat is opened with existing messages
  useEffect(() => {
    if (!isOpen || !messagesContainerRef.current || !messagesEndRef.current) {
      return;
    }

    // Only scroll if there are messages
    if (messages.length === 0) {
      return;
    }

    // Reset user scrolling flag when opening chat
    isUserScrollingRef.current = false;
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = null;
    }

    // Wait for DOM to be ready, then scroll to bottom
    const scrollToBottom = () => {
      if (messagesContainerRef.current && messagesEndRef.current) {
        // Scroll to bottom immediately (not smooth) for initial load
        // Use multiple attempts to ensure it works
        const attemptScroll = (attempts = 0) => {
          if (attempts > 5) return; // Max 5 attempts

          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "auto" });
          }

          // Check if scroll was successful, if not try again
          setTimeout(() => {
            if (messagesContainerRef.current && messagesEndRef.current) {
              const container = messagesContainerRef.current;
              const isAtBottom =
                container.scrollHeight -
                  container.scrollTop -
                  container.clientHeight <
                10;

              if (!isAtBottom && attempts < 5) {
                attemptScroll(attempts + 1);
              }
            }
          }, 100);
        };

        // Start scrolling after a short delay to ensure DOM is ready
        setTimeout(() => {
          attemptScroll();
        }, 100);
      }
    };

    // Use requestAnimationFrame to ensure layout is complete
    requestAnimationFrame(() => {
      scrollToBottom();
    });
  }, [isOpen, messages.length]);

  // Handle manual scroll detection
  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current) return;

    // Mark that user is manually scrolling
    isUserScrollingRef.current = true;

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Reset the flag after user stops scrolling for 1 second
    scrollTimeoutRef.current = setTimeout(() => {
      isUserScrollingRef.current = false;

      // If user scrolled back to bottom, allow auto-scroll again
      if (
        messagesContainerRef.current &&
        isNearBottom(messagesContainerRef.current)
      ) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }, 1000);
  }, [isNearBottom]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

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

  // Handle keyboard and click outside events
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showEmojiPicker) {
          setShowEmojiPicker(false);
        } else {
          setIsOpen(false);
        }
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest(
          '[aria-label*="emoji" i], [aria-label*="Emoji" i], button[class*="emoji"]'
        )
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, showEmojiPicker]);

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

  // Helper functions
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

  const resetTextarea = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, []);

  const handleStopListening = useCallback(() => {
    if (isListening) {
      isRestartingRef.current = false;
      setIsListening(false);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error("Error stopping speech recognition:", error);
        }
      }
    }
  }, [isListening]);

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

  const isDiscountRelated = (message: string): boolean => {
    const discountKeywords = [
      "discount",
      "diskon",
      "promo",
      "promosi",
      "sale",
      "diskon",
      "potongan",
      "harga murah",
      "murah",
      "cheap",
      "off",
      "hemat",
    ];
    const allProductsKeywords = [
      "semua produk",
      "all products",
      "semua product",
      "semua barang",
      "all items",
      "tampilkan semua",
      "show all",
      "lihat semua",
      "see all",
    ];
    const lowerMessage = message.toLowerCase();

    // Check if user is asking for all products (explicitly)
    const askingForAll = allProductsKeywords.some((keyword) =>
      lowerMessage.includes(keyword)
    );

    // If asking for all products, return false (don't filter by discount)
    if (askingForAll) {
      return false;
    }

    // Check if user is asking about discount
    return discountKeywords.some((keyword) => lowerMessage.includes(keyword));
  };

  const isPopularRelated = (message: string): boolean => {
    const popularKeywords = [
      "popular",
      "populer",
      "terpopuler",
      "paling popular",
      "paling populer",
      "produk popular",
      "produk populer",
      "terlaris",
      "paling laris",
      "best seller",
      "bestseller",
      "terbanyak diunduh",
      "paling banyak diunduh",
      "download terbanyak",
      "paling banyak download",
    ];
    const lowerMessage = message.toLowerCase();
    return popularKeywords.some((keyword) => lowerMessage.includes(keyword));
  };

  const isNewestRelated = (message: string): boolean => {
    const newestKeywords = [
      "terbaru",
      "paling baru",
      "baru",
      "newest",
      "latest",
      "produk terbaru",
      "produk baru",
      "produk latest",
      "produk newest",
      "yang baru",
      "yang terbaru",
      "recent",
      "terkini",
    ];
    const lowerMessage = message.toLowerCase();
    return newestKeywords.some((keyword) => lowerMessage.includes(keyword));
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

  const isCodingRelated = (message: string): boolean => {
    const codingKeywords = [
      "code",
      "coding",
      "programming",
      "program",
      "kode",
      "codingan",
      "koding",
      "program",
      "syntax",
      "function",
      "variable",
      "debug",
      "error",
      "bug",
      "fix code",
      "perbaiki code",
      "perbaiki kode",
      "bagaimana cara",
      "cara membuat",
      "tutorial",
      "belajar",
      "javascript",
      "typescript",
      "python",
      "java",
      "react",
      "nextjs",
      "node",
      "html",
      "css",
      "sql",
      "api",
      "endpoint",
      "database",
      "query",
      "algorithm",
      "algoritma",
      "loop",
      "array",
      "object",
      "class",
      "method",
      "import",
      "export",
      "component",
      "hook",
      "state",
      "props",
      "async",
      "await",
      "promise",
      "callback",
      "console.log",
      "console",
      "log",
      "return",
      "if else",
      "if statement",
      "switch",
      "for loop",
      "while loop",
      "try catch",
      "error handling",
      "git",
      "commit",
      "push",
      "pull",
      "branch",
      "merge",
      "repository",
      "repo",
    ];

    const lowerMessage = message.toLowerCase();

    // Check for coding-related keywords
    const hasCodingKeyword = codingKeywords.some((keyword) =>
      lowerMessage.includes(keyword)
    );

    // Check for patterns like "how to code", "cara coding", etc.
    const codingPatterns = [
      /(bagaimana|how to|how do|cara|tutorial|belajar).*(code|coding|program|kode|programming)/i,
      /(fix|perbaiki|debug|solve).*(code|kode|error|bug|problem)/i,
      /(buat|create|make).*(function|class|component|api|endpoint)/i,
      /(apa|what is|jelaskan).*(function|variable|class|component|hook|state)/i,
    ];

    const matchesPattern = codingPatterns.some((pattern) =>
      pattern.test(message)
    );

    return hasCodingKeyword || matchesPattern;
  };

  // Fungsi untuk mengecek apakah pertanyaan terkait dengan website Jelajah Kode
  const isWebsiteRelated = (message: string): boolean => {
    const lowerMessage = message.toLowerCase().trim();

    // Ucapan salam dan sapaan umum diperbolehkan
    const greetingKeywords = [
      "halo",
      "hello",
      "hi",
      "hai",
      "selamat pagi",
      "selamat siang",
      "selamat sore",
      "selamat malam",
      "good morning",
      "good afternoon",
      "good evening",
      "terima kasih",
      "thanks",
      "thank you",
      "makasih",
      "sama-sama",
      "you're welcome",
      "kabar",
      "apa kabar",
      "how are you",
      "baik",
      "baik-baik",
      "baik baik",
    ];

    // Kata kunci terkait website Jelajah Kode
    const websiteKeywords = [
      "jelajah kode",
      "jelajahkode",
      "jelajah",
      "website",
      "situs",
      "web",
      "layanan",
      "service",
      "jasa",
      "tentang",
      "about",
      "info",
      "informasi",
      "bantuan",
      "help",
      "help me",
      "tolong",
      "please",
      "bisa",
      "bisa bantu",
      "can you",
      "bisa tolong",
    ];

    // Cek apakah hanya ucapan salam
    const isOnlyGreeting = greetingKeywords.some((keyword) => {
      const regex = new RegExp(
        `^${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\s|\\?|!|\\.|,)*$`,
        "i"
      );
      return regex.test(lowerMessage);
    });

    // Jika hanya salam, dianggap terkait website
    if (isOnlyGreeting) {
      return true;
    }

    // Cek apakah terkait produk, kontak, atau website
    const isRelatedToWebsite =
      isProductRelated(message) ||
      isContactRelated(message) ||
      websiteKeywords.some((keyword) => lowerMessage.includes(keyword));

    return isRelatedToWebsite;
  };

  const fetchProductsData = async (
    filterDiscountOnly: boolean = false,
    productType: "popular" | "newest" | "default" = "default"
  ): Promise<{
    context: string;
    products: Product[];
  }> => {
    try {
      let endpoint = API_CONFIG.ENDPOINTS.products.base;

      // Determine endpoint based on product type
      if (productType === "popular") {
        endpoint = API_CONFIG.ENDPOINTS.products.popular(1, 20);
      } else if (productType === "newest") {
        // For newest, use base endpoint with sort by createdAt (default behavior)
        endpoint = API_CONFIG.ENDPOINTS.products.base;
      }

      const response = await fetch(endpoint, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_CONFIG.SECRET}`,
        },
      });

      if (!response.ok) {
        return { context: "", products: [] };
      }

      const data = await response.json();
      let products = Array.isArray(data) ? data : data?.data || [];

      if (products.length === 0) {
        return { context: "", products: [] };
      }

      // Filter products by discount if filterDiscountOnly is true
      if (filterDiscountOnly) {
        products = products.filter((product: Product) => {
          return (
            product.discount &&
            product.discount.value !== undefined &&
            product.discount.value > 0
          );
        });
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

      let contextMessage = "";

      if (productType === "popular") {
        contextMessage = filterDiscountOnly
          ? `Berikut adalah data produk POPULAR yang memiliki diskon:\n\n${productsContext}\n\nGunakan informasi ini untuk menjawab pertanyaan user tentang produk popular yang memiliki diskon. Hanya tampilkan produk popular yang memiliki diskon.`
          : `Berikut adalah data produk POPULAR (produk yang paling banyak diunduh):\n\n${productsContext}\n\nGunakan informasi ini untuk menjawab pertanyaan user tentang produk popular. Tampilkan produk-produk popular ini.`;
      } else if (productType === "newest") {
        contextMessage = filterDiscountOnly
          ? `Berikut adalah data produk TERBARU yang memiliki diskon:\n\n${productsContext}\n\nGunakan informasi ini untuk menjawab pertanyaan user tentang produk terbaru yang memiliki diskon. Hanya tampilkan produk terbaru yang memiliki diskon.`
          : `Berikut adalah data produk TERBARU:\n\n${productsContext}\n\nGunakan informasi ini untuk menjawab pertanyaan user tentang produk terbaru. Tampilkan produk-produk terbaru ini.`;
      } else {
        contextMessage = filterDiscountOnly
          ? `Berikut adalah data produk yang memiliki diskon:\n\n${productsContext}\n\nGunakan informasi ini untuk menjawab pertanyaan user tentang produk diskon. Hanya tampilkan produk yang memiliki diskon.`
          : `Berikut adalah data produk yang tersedia:\n\n${productsContext}\n\nGunakan informasi ini untuk menjawab pertanyaan user tentang produk.`;
      }

      return {
        context: contextMessage,
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

    // Check if message is about coding - block it
    if (isCodingRelated(userMessage)) {
      const userMsg: MessageAi = {
        id: generateMessageId(),
        sender: "user",
        content: userMessage,
        timestamp: getCurrentTime(),
        read: true,
      };

      const blockedMsg: MessageAi = {
        id: generateMessageId(),
        sender: "assistant",
        content:
          "Maaf, saya tidak dapat membantu dengan pertanyaan tentang coding atau programming. Saya hanya dapat membantu dengan informasi tentang produk, layanan, dan kontak. Terima kasih! 😊",
        timestamp: getCurrentTime(),
        read: false,
      };

      setMessages((prev) => [...prev, userMsg, blockedMsg]);
      setMessageInput("");
      setShowEmojiPicker(false);
      handleStopListening();
      resetTextarea();
      // Reset manual scroll flag and scroll to bottom
      isUserScrollingRef.current = false;
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
      }
      setTimeout(() => {
        if (messagesEndRef.current && !isUserScrollingRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 50);
      return;
    }

    // Check if message is related to website - block if not related
    if (!isWebsiteRelated(userMessage)) {
      const userMsg: MessageAi = {
        id: generateMessageId(),
        sender: "user",
        content: userMessage,
        timestamp: getCurrentTime(),
        read: true,
      };

      const blockedMsg: MessageAi = {
        id: generateMessageId(),
        sender: "assistant",
        content:
          "Maaf, saya tidak bisa menjawab pertanyaan yang Anda berikan. Saya hanya dapat membantu dengan pertanyaan seputar website, seperti informasi produk, layanan, kontak, dan hal-hal terkait website ini. Terima kasih! 😊",
        timestamp: getCurrentTime(),
        read: false,
      };

      setMessages((prev) => [...prev, userMsg, blockedMsg]);
      setMessageInput("");
      setShowEmojiPicker(false);
      handleStopListening();
      resetTextarea();
      // Reset manual scroll flag and scroll to bottom
      isUserScrollingRef.current = false;
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
      }
      setTimeout(() => {
        if (messagesEndRef.current && !isUserScrollingRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 50);
      return;
    }

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
    handleStopListening();
    resetTextarea();
    // Reset manual scroll flag when user sends a new message
    isUserScrollingRef.current = false;
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = null;
    }

    // Force scroll to bottom immediately when user sends a message
    setTimeout(() => {
      if (messagesEndRef.current && !isUserScrollingRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);

    setIsLoading(true);

    // Create AI message ID for later use
    const aiMsgId = generateMessageId();

    try {
      // Check if user is asking about products
      let productsContext = "";
      let productsData: Product[] = [];

      if (isProductRelated(userMessage)) {
        // Check if user is asking specifically about discounted products
        const filterDiscountOnly = isDiscountRelated(userMessage);

        // Determine product type based on user's question
        let productType: "popular" | "newest" | "default" = "default";
        if (isPopularRelated(userMessage)) {
          productType = "popular";
        } else if (isNewestRelated(userMessage)) {
          productType = "newest";
        }

        const result = await fetchProductsData(filterDiscountOnly, productType);
        productsContext = result.context;
        productsData = result.products;
      }

      // Check if user is asking about contact/custom website
      let contactContext = "";
      if (isContactRelated(userMessage)) {
        contactContext = `Informasi Kontak:
- Nomor WhatsApp: 085811668557
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
        systemContext = `Anda adalah AI Assistant. Saat user pertama kali mengirim pesan, sambut mereka dengan ramah menggunakan pesan berikut:
"Halo! 👋 Selamat datang!

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

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        transcriptRef.current = messageInput;
        isRestartingRef.current = false;
        setIsListening(true);
        recognitionRef.current.start();
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        setIsListening(false);
      }
    }
  }, [isListening, messageInput]);

  const stopListening = useCallback(() => {
    handleStopListening();
  }, [handleStopListening]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isOpen,
    setIsOpen,
    messageInput,
    setMessageInput,
    isTyping: isLoading,
    messages,
    isLoading,
    messagesEndRef,
    messagesContainerRef,
    handleScroll,
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
