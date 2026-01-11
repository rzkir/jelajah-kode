/**
 * Utility function untuk memanggil API chat dengan streaming response
 * @param options - Konfigurasi untuk API call
 * @returns Promise yang resolve ketika streaming selesai
 */
export async function streamChat({
  endpoint,
  messages,
  onChunk,
  onError,
}: StreamChatOptions): Promise<void> {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
          ...(msg.imageUrl && { imageUrl: msg.imageUrl }),
        })),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get response");
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error("No response body");
    }

    let accumulatedContent = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") break;

          try {
            const json = JSON.parse(data);
            if (json.content) {
              accumulatedContent += json.content;
              onChunk(accumulatedContent);
            }
          } catch {
            // Skip invalid JSON
          }
        }
      }
    }
  } catch (error) {
    console.error("Error in streamChat:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Maaf, terjadi kesalahan. Silakan coba lagi.";

    if (onError) {
      onError(errorMessage);
    } else {
      throw error;
    }
  }
}
