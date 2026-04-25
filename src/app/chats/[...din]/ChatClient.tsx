'use client';

import { API } from '@/lib/API';
import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';
import ChatSettings from './ChatSettings';

interface Message {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
}

interface ChatClientProps {
  room: string;
  name: string;
}

export default function ChatClient({ room, name }: ChatClientProps) {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [online, set_online] = useState<number>(0)
  const socket = useRef<any>(null);
  const name_comnat = useRef('')

  async function fetchMessages() {
    try {
      const res = await fetch(`${API.api}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: room }),
      });
      const data = await res.json();
      console.log('Данные от сервера:', data, room);
      setMessages(data.messages.map((msg: any) => {
        return {
          id: msg.id,
          author: msg.name,
          content: msg.content,
          timestamp: new Date(msg.createdAt),
          isOwn: msg.name === decodeURIComponent(name),
        }
      }));
      name_comnat.current = data.name
      setLoading(false);
    } catch (error) {
      console.error('Ошибка при загрузке сообщений:', error);
      alert('Не удалось загрузить сообщения. Пожалуйста, попробуйте снова.');
    }
  }

  function fetchMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!messageInput.trim() || !socket.current?.connected) {
      console.warn("Соединение еще не установлено");
      alert('Соединение еще не установлено. Пожалуйста, подождите и попробуйте снова.');
      return;
    }

    socket.current.emit('sendMessage', {
      "chatId": decodeURIComponent(room),
      "message": messageInput,
      "name": decodeURIComponent(name)
    });

    setMessageInput('');
  }

  useEffect(() => {
    fetchMessages()
    let ios = io(API.api_socet, {
      transports: ['websocket']
    })
    socket.current = ios

    ios.on('joinedChat', (data: { ChatId: string, securoti: boolean }) => {
      if (data.securoti) {
        alert('сокет успешно установлен')
        return
      }
      alert('не удалось установить связь перезагрузите страницу')
    })

    ios.on('newMessage', (data: { id: string, content: string, chatId: string, name: string, createdAt: string }) => {
      setMessages((prev) => [...prev, {
        id: data.id,
        content: data.content,
        author: data.name,
        timestamp: new Date(data.createdAt),
        isOwn: data.name === decodeURIComponent(name),
      }])
    })

    ios.on('connect', () => {
      console.log('Connected to server')
      console.log('Joining chat room:', decodeURIComponent(room))
      ios.emit('joinChat', { ChatId: decodeURIComponent(room) })
    })

    ios.on('onlineCount', (data) => {
      console.log('онлайн' + data)
      set_online(data)
    })

    return () => {
      ios.disconnect()
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-gray-500 dark:text-gray-400 text-lg sm:text-xl font-medium ">
          Загрузка сообщений... ⏳
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Заголовок чата */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-md">
        <div className="max-w-full mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/')}
              className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-105 active:scale-95 font-semibold"
            >
              ←
            </button>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">
                # {name_comnat.current}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Вы в чате как <span className="font-semibold text-blue-600 dark:text-cyan-400">{decodeURIComponent(name)}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className=" text-sm text-gray-500 dark:text-gray-400">
              👥 онлайн в чате: {online === 0 ? 'ошибка' : online}
            </div>
            <ChatSettings roomName={room} />
          </div>
        </div>
      </div>
      {/* Область сообщений с красивой прокруткой */}
      <div className="flex-1 mb-16 sm:mb-20 mt-17 sm:mt-21 overflow-y-auto w-full p-2.5">
        <div className="w-full space-y-4  ">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs sm:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl shadow-sm transition-all hover:shadow-md ${message.isOwn
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-none'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
                  }`}
              >
                {!message.isOwn && (
                  <p className="text-xs font-semibold mb-1 opacity-75">
                    {message.author}
                  </p>
                )}
                <p className="break-words text-sm sm:text-base">{message.content}</p>
                <p className={`text-xs mt-1 ${message.isOwn ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      {/* Поле ввода сообщения */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
        <form onSubmit={fetchMessage} className="max-w-full mx-auto px-4 sm:px-6 py-3 sm:py-4 flex gap-2 sm:gap-3">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Напишите сообщение..."
            className="flex-1 px-4 py-2 sm:py-3 text-base border border-gray-300 dark:border-gray-600 
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
            rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-all duration-200 min-w-11 "
          />
          <button
            type="submit"
            className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700
            text-white font-semibold rounded-2xl transition-all duration-200 transform hover:scale-105 active:scale-95
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 shadow-md"
          >
            <span className="hidden sm:inline">Отправить </span>
            <span className="sm:hidden">📤</span>
          </button>
        </form>
      </div>
    </div>
  );
}
