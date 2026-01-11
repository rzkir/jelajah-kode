interface Message {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
}

interface StreamChatOptions {
  endpoint: string;
  messages: Message[];
  onChunk: (content: string) => void;
  onError?: (error: string) => void;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => unknown) | null;
  onresult:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => unknown)
    | null;
  onerror:
    | ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => unknown)
    | null;
  onend: ((this: SpeechRecognition, ev: Event) => unknown) | null;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface MessageAi {
  id: string;
  sender: "user" | "assistant" | "admin";
  content: string;
  timestamp: string;
  read: boolean;
  products?: Product[];
}

interface Product {
  _id?: string;
  productsId?: string;
  title: string;
  thumbnail: string;
  price: number;
  category?: { title?: string };
  type?: { title?: string };
  status?: string;
  stock?: number;
  sold?: number;
  ratingAverage?: number;
  ratingCount?: number;
  discount?: { type?: string; value?: number };
  description?: string;
}

interface CtaProps {
  className?: string;
}
