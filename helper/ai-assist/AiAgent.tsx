"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Send, Plus, Smile, X, Mic, MicOff } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { cn } from '@/lib/utils'
import useStateAiAgent from './lib/useStateAiAgent'
import EmojiPicker, { Theme } from 'emoji-picker-react'

interface CtaProps {
    className?: string
}

export default function Cta({
    className
}: CtaProps) {
    const {
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
    } = useStateAiAgent()

    const conversationName = "AI Assistant"
    const conversationAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=ai"
    const isOnline = true

    return (
        <>
            <motion.button
                onClick={async () => {
                    await enableAudio();
                    setIsOpen(true);
                }}
                className={cn(
                    "fixed bottom-6 right-6 px-5 py-3.5 rounded-full cursor-pointer bg-linear-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all shadow-xl hover:shadow-2xl z-40 flex items-center gap-2.5 font-semibold text-sm",
                    className
                )}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                }}
                aria-label="Buka Chat Assistant"
            >
                <Bot className="w-5 h-5" />
                <span>Assistant</span>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                            onClick={() => {
                                setIsOpen(false)
                                setShowEmojiPicker(false)
                                if (isListening) {
                                    stopListening()
                                }
                            }}
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, y: 30, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 30, scale: 0.96 }}
                            transition={{ type: "spring", damping: 30, stiffness: 350 }}
                            className="fixed bottom-28 right-6 w-full max-w-[480px] h-[640px] max-h-[calc(100vh-9rem)] flex flex-col z-50 overflow-hidden"
                        >
                            {/* Chat Interface */}
                            <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-2xl">
                                {/* Chat Header */}
                                <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <Avatar className="w-11 h-11 ring-2 ring-blue-500/20 ring-offset-2 ring-offset-white dark:ring-offset-gray-900">
                                                    <AvatarImage src={conversationAvatar || "/placeholder.svg"} />
                                                    <AvatarFallback className="bg-linear-to-br from-blue-500 to-blue-600 text-white font-semibold text-sm">
                                                        {conversationName.slice(0, 2)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                {isOnline && (
                                                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 shadow-sm" />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-base text-gray-900 dark:text-white">{conversationName}</h3>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-400"}`} />
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                                        {isOnline ? "Active now" : "Offline"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                            onClick={() => {
                                                setIsOpen(false)
                                                setShowEmojiPicker(false)
                                                if (isListening) {
                                                    stopListening()
                                                }
                                            }}
                                            aria-label="Tutup"
                                        >
                                            <X className="w-4.5 h-4.5 text-gray-600 dark:text-gray-400" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Messages Area */}
                                <div className="flex-1 bg-gray-50/50 dark:bg-gray-950/50 overflow-y-auto overscroll-contain scrollbar-minimal">
                                    <div className="p-5 space-y-4 min-h-full">
                                        {messages.length === 0 && (
                                            <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 min-h-[450px]">
                                                <div className="w-20 h-20 rounded-full bg-linear-to-br from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-800/10 flex items-center justify-center mb-5">
                                                    <svg className="w-10 h-10 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                    </svg>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Mulai percakapan dengan AI Assistant</p>
                                                <p className="text-xs mt-1.5 text-gray-500 dark:text-gray-400">Kirim pesan untuk memulai chat</p>
                                            </div>
                                        )}
                                        {messages.map((msg) => (
                                            <div key={msg.id} className={`flex flex-col gap-2.5 ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                                                <div
                                                    className={`group max-w-[75%] px-4 py-2.5 rounded-2xl transition-all duration-200 ${msg.sender === "user"
                                                        ? "bg-linear-to-br from-blue-600 to-blue-700 text-white rounded-br-sm shadow-md hover:shadow-lg"
                                                        : msg.sender === "admin"
                                                            ? "bg-linear-to-br from-green-500 to-green-600 text-white rounded-bl-sm border border-green-400 shadow-md hover:shadow-lg"
                                                            : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-sm border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md"
                                                        }`}
                                                >
                                                    {msg.sender === "admin" && (
                                                        <div className="flex items-center gap-1.5 mb-1.5">
                                                            <span className="text-xs font-semibold text-green-100">Admin</span>
                                                        </div>
                                                    )}
                                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                                    <div className={`flex items-center gap-1.5 mt-1.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                                                        <p className={`text-xs font-medium ${msg.sender === "user" ? "text-blue-100" : msg.sender === "admin" ? "text-green-100" : "text-gray-500 dark:text-gray-400"}`}>{msg.timestamp}</p>
                                                        {msg.sender === "user" && (
                                                            <svg className="w-3 h-3 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Products List */}
                                                {msg.sender === "assistant" && msg.products && msg.products.length > 0 && (
                                                    <div className="mt-1 w-full max-w-[85%]">
                                                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-3 border border-gray-200 dark:border-gray-700 shadow-sm">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <div className="w-1 h-4 bg-linear-to-b from-blue-500 to-blue-600 rounded-full" />
                                                                <h4 className="font-semibold text-sm text-gray-900 dark:text-white">Daftar Produk</h4>
                                                            </div>
                                                            <div className="space-y-2.5">
                                                                {msg.products.map((product, idx) => {
                                                                    const hasActiveDiscount = product.discount && product.discount.value !== undefined && product.discount.value > 0
                                                                    const discountValue = product.discount?.value ?? 0
                                                                    const discountedPrice = hasActiveDiscount && product.discount?.type === "percentage"
                                                                        ? product.price * (1 - discountValue / 100)
                                                                        : hasActiveDiscount && product.discount?.type === "fixed"
                                                                            ? product.price - discountValue
                                                                            : product.price

                                                                    return (
                                                                        <div
                                                                            key={product.productsId || product._id || idx}
                                                                            className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all duration-200 group cursor-pointer"
                                                                        >
                                                                            {/* Product Image */}
                                                                            <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-gray-200 dark:border-gray-700 group-hover:border-blue-400 dark:group-hover:border-blue-600 transition-colors">
                                                                                {product.thumbnail ? (
                                                                                    <Image
                                                                                        src={product.thumbnail}
                                                                                        alt={product.title}
                                                                                        fill
                                                                                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                                                    />
                                                                                ) : (
                                                                                    <div className="w-full h-full bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                                                                                        <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">No image</span>
                                                                                    </div>
                                                                                )}
                                                                            </div>

                                                                            {/* Product Info */}
                                                                            <div className="flex-1 min-w-0">
                                                                                <h5 className="font-semibold text-sm mb-1.5 line-clamp-1 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                                                    {product.title}
                                                                                </h5>
                                                                                <div className="flex flex-wrap gap-1.5 mb-2">
                                                                                    {product.category?.title && (
                                                                                        <Badge variant="secondary" className="text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-0">
                                                                                            {product.category.title}
                                                                                        </Badge>
                                                                                    )}
                                                                                    {product.type?.title && (
                                                                                        <Badge variant="outline" className="text-xs font-medium border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                                                                                            {product.type.title}
                                                                                        </Badge>
                                                                                    )}
                                                                                    {hasActiveDiscount && product.discount && (
                                                                                        <Badge variant="destructive" className="text-xs font-bold bg-red-500 text-white border-0">
                                                                                            {product.discount.type === "percentage"
                                                                                                ? `-${discountValue}%`
                                                                                                : `-Rp ${discountValue.toLocaleString('id-ID')}`}
                                                                                        </Badge>
                                                                                    )}
                                                                                </div>
                                                                                <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                                                                                    <span className={`font-bold text-sm ${hasActiveDiscount ? "text-gray-400 dark:text-gray-500 line-through" : "text-blue-600 dark:text-blue-400"}`}>
                                                                                        Rp {product.price.toLocaleString('id-ID')}
                                                                                    </span>
                                                                                    {hasActiveDiscount && (
                                                                                        <span className="font-bold text-base text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md">
                                                                                            Rp {Math.round(discountedPrice).toLocaleString('id-ID')}
                                                                                        </span>
                                                                                    )}
                                                                                    {product.ratingAverage && product.ratingAverage > 0 && (
                                                                                        <span className="text-xs text-gray-600 dark:text-gray-400 font-medium bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                                                                                            ⭐ {product.ratingAverage.toFixed(1)} ({product.ratingCount || 0})
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                                {product.stock !== undefined && (
                                                                                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                                        <span className="font-medium">📦 Stock: {product.stock}</span>
                                                                                        <span className="font-medium">💰 Terjual: {product.sold || 0}</span>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        {isTyping && (
                                            <div className="flex justify-start">
                                                <div className="bg-white dark:bg-gray-800 px-4 py-2.5 rounded-2xl rounded-bl-sm border border-gray-200 dark:border-gray-700 shadow-sm">
                                                    <div className="flex gap-1.5 items-center">
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>
                                </div>

                                {/* Input Area */}
                                <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0">
                                    <div className="flex items-end gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500/50 transition-all w-full relative">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shrink-0">
                                            <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        </Button>
                                        <div className="flex-1 relative max-h-[120px] overflow-y-auto scrollbar-textarea">
                                            <textarea
                                                ref={textareaRef}
                                                placeholder={isSpeechSupported ? "Ketik atau klik mikrofon untuk berbicara..." : "Type a message..."}
                                                value={messageInput}
                                                onChange={(e) => {
                                                    setMessageInput(e.target.value)
                                                    // Auto resize textarea
                                                    e.target.style.height = 'auto'
                                                    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" && !e.shiftKey) {
                                                        e.preventDefault()
                                                        if (isListening) {
                                                            stopListening()
                                                        }
                                                        handleSendMessage()
                                                    }
                                                }}
                                                rows={1}
                                                className="w-full bg-transparent outline-none text-sm placeholder-gray-400 dark:placeholder-gray-500 font-medium text-gray-900 dark:text-white resize-none overflow-hidden min-h-[24px] py-1 pr-28"
                                                style={{ minHeight: '24px' }}
                                            />

                                            {isSpeechSupported && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className={cn(
                                                        "absolute bottom-1 right-20 h-8 w-8 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shrink-0 z-10",
                                                        isListening && "bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30"
                                                    )}
                                                    onClick={toggleListening}
                                                    aria-label={isListening ? "Stop listening" : "Start voice input"}
                                                    title={isListening ? "Hentikan rekaman suara" : "Mulai rekaman suara"}
                                                >
                                                    {isListening ? (
                                                        <MicOff className="w-4 h-4 text-red-600 dark:text-red-400 animate-pulse" />
                                                    ) : (
                                                        <Mic className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                    )}
                                                </Button>
                                            )}

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute bottom-1 right-10 h-8 w-8 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shrink-0 z-10"
                                                onClick={toggleEmojiPicker}
                                                aria-label="Toggle emoji picker"
                                            >
                                                <Smile className={cn("w-4 h-4 text-gray-600 dark:text-gray-400", showEmojiPicker && "text-blue-600 dark:text-blue-400")} />
                                            </Button>
                                            <Button
                                                size="icon"
                                                className="absolute bottom-1 right-1 h-8 w-8 rounded-lg bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0 z-10"
                                                onClick={handleSendMessage}
                                                disabled={!messageInput.trim() || isLoading}
                                            >
                                                <Send className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        {/* Emoji Picker */}
                                        <AnimatePresence>
                                            {showEmojiPicker && (
                                                <motion.div
                                                    ref={emojiPickerRef}
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="absolute bottom-full right-0 mb-2 z-50"
                                                >
                                                    <div className="shadow-2xl rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                                                        <EmojiPicker
                                                            onEmojiClick={handleEmojiClick}
                                                            theme={Theme.AUTO}
                                                            width={350}
                                                            height={400}
                                                            previewConfig={{
                                                                showPreview: false
                                                            }}
                                                        />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center font-medium">Press Enter to send, Shift+Enter for new line</p>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}