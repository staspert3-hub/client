'use client';

import { API } from '@/lib/API';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [nickname, setNickname] = useState('');
  const [room, setRoom] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<'create-room' | 'register-name' | null>(null);
  const [roomName, setRoomName] = useState('');
  const [roomDescription, setRoomDescription] = useState('');
  const [roomCreatorNick, setRoomCreatorNick] = useState('');
  const [registerNick, setRegisterNick] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState('');
  const [registerFullName, setRegisterFullName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [register_comnat, setregister_comnat] = useState<null | 'secured' | 'error'>(null);
  const [createdRoomId, setCreatedRoomId] = useState('');
  const [createdRoomName, setCreatedRoomName] = useState('');
  const [roomErrorMessage, setRoomErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [registerUserSecured, setRegisterUserSecured] = useState<null | 'secured'>(null);
  const [registeredNick, setRegisteredNick] = useState('');
  const [registeredPassword, setRegisteredPassword] = useState('');
  const [copiedNick, setCopiedNick] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [password, setPassword] = useState('')
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Обработка отправки формы
    console.log({ nickname, room });
    try {
      const res = await fetch(`${API.api}/chat/find`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: room }),
      });
      if (!res.ok) {
        console.log('критическая ошибка', res.statusText);
        throw new Error('Ошибка при поиске комнаты ');
      }
      const res1 = await fetch(`${API.api}/auth/sec_password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, user_username: nickname }),
      });
      if (!res1.ok) {
        console.log('критическая ошибка', res1.statusText);
        throw new Error('Ошибка при проверке пароля');
      }
      const data1 = await res1.json();
      if (data1.s === false) {
        alert('Неверный пароль');
        return;
      }
      const data = await res.json();

      if (data.error) {
        alert(data.error);
        return
      }
      console.log('Комната найдена, обрабатываем ответ...');

      router.push(`/chats/${data.id}/${nickname}`);
    } catch (error) {
      console.error('Ошибка при присоединении к чату:', error);
      alert('критическая ошибка');
    }
  };

  // page.tsx
  const Register_login = async () => {
    // ... ваши проверки if ...
    console.log('Register_login')
    if (!(registerEmail && registerFullName.length >= 2 && registerPassword.length >= 6 && registerNick)) {
      alert('заполните поля')
      return
    }

    try {
      const res1 = await fetch(`${API.api}/auth/register`, {
        method: 'POST',
        body: JSON.stringify({
          name: registerFullName,
          username: registerNick,
          email: registerEmail,
          password: registerPassword
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      })
      const res = await res1.json()
      if (res.s === false) throw (res.m)
      console.log(res)
      setRegisteredNick(registerNick);
      setRegisteredPassword(registerPassword);
      setRegisterUserSecured('secured');
      setRegisterEmail('')
      setRegisterFullName('')
      setRegisterNick('')
      setRegisterPassword('')
      setRegisterPasswordConfirm('')
    } catch (er) {
      console.log(er)
      alert(er)
    }
  };


  return (
    <div className="min-h-screen w-full  flex items-center justify-center  p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md ">
        {/* Основной контейнер формы */}
        <div className="bg-white dark:bg-gray-800 border-2 sm:border-4 border-gray-300 dark:border-gray-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          {/* Заголовок */}
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
            Добро пожаловать
          </h1>

          {/* Форма */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Поле ввода ника */}
            <div>
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ваш ник
              </label>
              <input
                id="nickname"
                type="text"
                placeholder="Введите ник"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-gray-400 dark:border-gray-500 rounded-lg sm:rounded-2xl 
                background-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                transition-all duration-200 hover:border-gray-500 dark:hover:border-gray-400"
              />
            </div>

            {/* Поле ввода пароля */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                пароль от никнейма
              </label>
              <input
                id="password"
                type="text"
                placeholder="Введите пароль от никнейма"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-gray-400 dark:border-gray-500 rounded-lg sm:rounded-2xl 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                transition-all duration-200 hover:border-gray-500 dark:hover:border-gray-400"
              />
            </div>
            <div>
              <label htmlFor="room" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Комната чата
              </label>
              <input
                id="room"
                type="text"
                placeholder="Введите название комнаты"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-gray-400 dark:border-gray-500 rounded-lg sm:rounded-2xl 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                transition-all duration-200 hover:border-gray-500 dark:hover:border-gray-400"
              />
            </div>

            {/* Кнопка отправки */}
            <button
              type="submit"
              disabled={!nickname.trim() || !room.trim()}
              className="w-full mt-6 px-6 py-3 text-base sm:text-lg font-semibold 
              bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
              text-white border-2 border-blue-700 dark:border-blue-500 rounded-lg sm:rounded-xl
              transition-all duration-200 transform hover:scale-105 active:scale-95
              shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Присоединиться
            </button>
          </form>

          {/* Информационное сообщение */}
          <p className="text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-6">
            ✨ Введите ник и выберите комнату для начала чата
          </p>
        </div>

        {/* Дополнительная карточка с советами (только на больших экранах) */}
        <div className="hidden sm:block mt-8 bg-cyan-50 dark:bg-gray-700 border border-cyan-200 dark:border-gray-600 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-cyan-900 dark:text-cyan-300 mb-2">💡 Советы</h3>
          <ul className="text-xs text-cyan-800 dark:text-cyan-200 space-y-1">
            <li>• Выберите уникальный ник</li>
            <li>• Используйте понятное название комнаты</li>
            <li>• Присоединяйтесь к друзьям по названию комнаты</li>
          </ul>
        </div>
      </div>

      {/* Кнопка плюсик в нижнем левом углу */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 left-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110 active:scale-95 flex items-center justify-center text-3xl font-bold z-40"
      >
        +
      </button>

      <AnimatePresence mode="wait">
        {/* Модальное окно с анимацией */}
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40  backdrop-blur-xl flex items-center justify-center z-50 "
            onClick={() => setIsModalOpen(false)}
          >
            <AnimatePresence>
              <motion.div
                layout="size"
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="bg-white/10 border border-white/20  backdrop-blur-xl rounded-2xl shadow-2xl p-8 max-w-[400px] m-2 space-y-4 overflow-hidden max-h-[600px] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <AnimatePresence mode='wait'>
                  {selectedOption === null && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key="options"
                      className="space-y-4"
                    >
                      <motion.h3
                        className="text-2xl font-semibold text-white text-center "
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        регистратор
                      </motion.h3>

                      <motion.div
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelectedOption('create-room')}
                        className="w-full bg-gradient-to-r text-center from-blue-500 to-purple-500 transition-colors text-white rounded-xl px-6 py-3 font-medium shadow-lg mb-2"
                      >
                        создать комнату
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                        className=' backdrop-blur-2xl border border-white/20 rounded-xl p-4 mb-6 '
                      >
                        <ul className="space-y-2 text-[11px] text-white/70">
                          <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0 mt-1"></span>
                            <span>Общение с друзьями в реальном времени</span>
                          </li>

                          <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0 mt-1"></span>
                            <span>Приглашай людей по ссылке</span>
                          </li>

                          <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-pink-400 rounded-full flex-shrink-0 mt-1"></span>
                            <span>Быстрое создание без регистрации</span>
                          </li>
                        </ul>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelectedOption('register-name')}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-center text-white rounded-xl px-6 py-3 font-medium mb-2 pointer-coarse:"
                      >
                        зарегистрировать ник
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.6 }}
                        className='backdrop-blur-2xl border border-white/20 rounded-xl p-4'
                      >
                        <ul className="space-y-2 text-[11px] text-white/70">
                          <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-cyan-300 rounded-full flex-shrink-0 mt-1"></span>
                            <span>Ваш ник защищён паролем и привязан только к вам</span>
                          </li>

                          <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full flex-shrink-0 mt-1"></span>
                            <span>Без доступа к паролю никто не сможет его занять или использовать</span>
                          </li>

                          <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-fuchsia-300 rounded-full flex-shrink-0 mt-1 "></span>
                            <span>Уникальный ник с защитой — только вы имеете доступ</span>
                          </li>
                        </ul>
                      </motion.div>
                    </motion.div>
                  )}
                  {selectedOption === 'register-name' && registerUserSecured !== 'secured' && (
                    <motion.div
                      key="register-name"
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className="space-y-4"
                    >
                      <motion.div
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelectedOption(null)}
                        className="text-sm text-white/70 cursor-pointer flex items-center gap-1 hover:text-white/90 transition-colors"
                      >
                        ← назад
                      </motion.div>

                      <motion.h3
                        className="text-lg sm:text-2xl font-semibold text-white text-center mb-6"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        зарегистрировать ник
                      </motion.h3>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-4"
                      >
                        {/* Поле ника */}
                        <div>
                          <label className="block text-sm font-medium text-white/80 mb-2">
                            Ник
                          </label>
                          <input
                            type="text"
                            placeholder="Введите свой ник"
                            value={registerNick}
                            maxLength={20}
                            onChange={(e) => setRegisterNick(e.target.value)}
                            className="w-full px-4 py-2.5 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                          />
                          <p className="text-xs text-white/50 mt-1">
                            {registerNick.length}/20 символов
                          </p>
                        </div>

                        {/* Поле полного имени */}
                        <div>
                          <label className="block text-sm font-medium text-white/80 mb-2">
                            Ваше имя
                          </label>
                          <input
                            type="text"
                            placeholder="Введите ваше имя"
                            value={registerFullName}
                            onChange={(e) => setRegisterFullName(e.target.value)}
                            className="w-full px-4 py-2.5 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                          />
                        </div>

                        {/* Поле email */}
                        <div>
                          <label className="block text-sm font-medium text-white/80 mb-2">
                            Email <span className="text-white/50 text-xs">(необязательно)</span>
                          </label>
                          <input
                            type="email"
                            placeholder="Введите ваш email"
                            value={registerEmail}
                            onChange={(e) => setRegisterEmail(e.target.value)}
                            className="w-full px-4 py-2.5 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                          />
                        </div>

                        {/* Поле пароля */}
                        <div>
                          <label className="block text-sm font-medium text-white/80 mb-2">
                            Пароль
                          </label>
                          <input
                            type="password"
                            placeholder="Придумайте пароль"
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)}
                            className="w-full px-4 py-2.5 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                          />
                          <p className="text-xs text-white/50 mt-1">
                            {registerPassword.length > 0 ? '✓ Пароль заполнен' : '• Минимум 6 символов'}
                          </p>
                        </div>

                        {/* Поле подтверждения пароля */}
                        <div>
                          <label className="block text-sm font-medium text-white/80 mb-2">
                            Подтвердите пароль
                          </label>
                          <input
                            type="password"
                            placeholder="Повторите пароль"
                            value={registerPasswordConfirm}
                            onChange={(e) => setRegisterPasswordConfirm(e.target.value)}
                            className="w-full px-4 py-2.5 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                          />
                          <p className="text-xs mt-1">
                            {registerPasswordConfirm === '' ? (
                              <span className="text-white/50">• Подтвердите пароль</span>
                            ) : registerPassword === registerPasswordConfirm ? (
                              <span className="text-green-400">✓ Пароли совпадают</span>
                            ) : (
                              <span className="text-red-400">✗ Пароли не совпадают</span>
                            )}
                          </p>
                        </div>

                        {/* Кнопка регистрации */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={!registerNick.trim() || !registerFullName.trim() || registerPassword.length < 6 || registerPassword !== registerPasswordConfirm}
                          onClick={Register_login}
                          className="w-full mt-4 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 shadow-lg"
                        >
                          🔐 Зарегистрировать
                        </motion.button>

                        {/* Информационный блок */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="bg-white/5 border border-white/10 rounded-lg p-3 mt-4"
                        >
                          <p className="text-xs text-white/60">
                            🛡️ Ваш ник будет защищён паролем и никто не сможет его использовать без вашего разрешения
                          </p>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  )}

                  {selectedOption === 'register-name' && registerUserSecured === 'secured' && (
                    <motion.div
                      key="user-registered"
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className="space-y-6 text-center"
                    >
                      {/* Анимированный значок */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="text-5xl"
                      >
                        🔐
                      </motion.div>

                      <motion.h3
                        className="text-2xl font-bold text-white"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        Ник успешно зарегистрирован!
                      </motion.h3>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-4"
                      >
                        <p className="text-white/70 text-sm">
                          Сохраните эти данные для входа в чат к другу
                        </p>

                        {/* Блок с ником */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 }}
                          className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/50 rounded-xl p-4 backdrop-blur-sm text-left"
                        >
                          <p className="text-xs text-white/60 mb-2">Ваш ник</p>
                          <p className="text-lg font-mono font-bold text-purple-300 break-all">
                            {registeredNick}
                          </p>
                        </motion.div>

                        {/* Блок с паролем */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.6 }}
                          className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-400/50 rounded-xl p-4 backdrop-blur-sm text-left"
                        >
                          <p className="text-xs text-white/60 mb-2">Пароль</p>
                          <p className="text-lg font-mono font-bold text-pink-300 break-all">
                            {registeredPassword}
                          </p>
                        </motion.div>

                        {/* Кнопка копирования ника */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            if (navigator.clipboard) {
                              navigator.clipboard.writeText(registeredNick);
                            } else {
                              alert('ошибка при копировании')
                              return
                            }
                            setCopiedNick(true);
                            setTimeout(() => setCopiedNick(false), 2000);
                          }}
                          className="w-full px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg"
                        >
                          {copiedNick ? '✓ Ник скопирован!' : '📋 Копировать ник'}
                        </motion.button>

                        {/* Кнопка копирования пароля */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            if (navigator.clipboard) {
                              navigator.clipboard.writeText(registeredPassword);
                            } else {
                              alert('ошибка при копировании')
                              return
                            }
                            setCopiedPassword(true);
                            setTimeout(() => setCopiedPassword(false), 2000);
                          }}
                          className="w-full px-4 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg"
                        >
                          {copiedPassword ? '✓ Пароль скопирован!' : '📋 Копировать пароль'}
                        </motion.button>

                        {/* Информационный блок */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.7 }}
                          className="bg-white/5 border border-white/10 rounded-lg p-3 mt-4"
                        >
                          <p className="text-xs text-white/60 leading-tight">
                            💾 Сохраните ник и пароль! Эти данные понадобятся вам для входа в чат к другу в будущем. Передайте ник другу, и он сможет с вами общаться.
                          </p>
                        </motion.div>

                        {/* Кнопка закрытия */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setRegisterUserSecured(null);
                            setSelectedOption(null);
                            setIsModalOpen(false);
                            setRegisteredNick('');
                            setRegisteredPassword('');
                          }}
                          className="w-full px-4 py-2 mt-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all duration-200"
                        >
                          ← Вернуться в меню
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  )}

                  {selectedOption === 'create-room' && register_comnat === null && (
                    <motion.div
                      key="register-name"
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className="space-y-4"
                    >
                      <motion.div
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelectedOption(null)}
                        className="text-sm text-white/70 mb-4 cursor-pointer flex items-center gap-1 rounded-lg hover:text-white/90 transition-colors"
                      >
                        ← назад
                      </motion.div>

                      <motion.h3
                        className="text-2xl font-semibold text-white text-center mb-6"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        создать комнату
                      </motion.h3>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-4"
                      >
                        {/* Поле названия комнаты */}
                        <div>
                          <label className="block text-sm font-medium text-white/80 mb-2">
                            Название комнаты
                          </label>
                          <input
                            type="text"
                            placeholder="Введите название"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            className="w-full px-4 py-2.5 text-sm bg-white/10 border border-white/20 rounded-lg 
                            text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 
                            focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                          />
                          <p className="text-xs text-white/50 mt-1">
                            {roomName.length}/30
                          </p>
                        </div>

                        {/* Поле описания */}
                        <div>
                          <label className="block text-sm font-medium text-white/80 mb-2">
                            Описание (опционально)
                          </label>
                          <textarea
                            placeholder="О чём эта комната?"
                            value={roomDescription}
                            onChange={(e) => setRoomDescription(e.target.value.slice(0, 100))}
                            rows={3}
                            className="w-full px-4 py-2.5 text-sm bg-white/10 border border-white/20 rounded-lg 
                            text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 
                            focus:border-transparent transition-all duration-200 backdrop-blur-sm resize-none"
                          />
                          <p className="text-xs text-white/50 mt-1">
                            {roomDescription.length}/100
                          </p>
                        </div>

                        {/* Поле ника создателя комнаты */}
                        <div>
                          <label className="block text-sm font-medium text-white/80 mb-2">
                            Ваш ник в этой комнате
                          </label>
                          <input
                            type="text"
                            placeholder="Введите свой ник"
                            value={roomCreatorNick}
                            maxLength={20}
                            onChange={(e) => setRoomCreatorNick(e.target.value)}
                            className="w-full px-4 py-2.5 text-sm bg-white/10 border border-white/20 rounded-lg 
                            text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 
                            focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                          />
                          <p className="text-xs text-white/50 mt-1">
                            {roomCreatorNick.length}/20 символов
                          </p>
                        </div>

                        {/* Кнопка создания */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={!roomName.trim() || !roomCreatorNick.trim()}
                          onClick={async () => {
                            if (roomName.trim()) {
                              console.log({ roomName, roomDescription });
                              try {
                                const res = await fetch(`${API.api}/chat/create`, {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({ name: roomName, creatorNick: roomCreatorNick }),
                                });
                                if (!res.ok) {
                                  console.log('критическая ошибка', res.statusText);
                                  setregister_comnat('error');
                                  setRoomErrorMessage('запрос ivalide')
                                  return;
                                }
                                const data = await res.json();
                                if (data.e) {
                                  setRoomErrorMessage(data.e);
                                  setregister_comnat('error');
                                  return;
                                }
                                console.log('Комната создана:', data);
                                setCreatedRoomId(data.id);
                                setCreatedRoomName(data.name);
                                setregister_comnat('secured');
                              } catch (e) {
                                console.log(e)
                                setregister_comnat('error')
                                setRoomErrorMessage('крит ошибка')
                                return
                              }
                              setRoomName('');
                              setRoomDescription('');
                              setRoomCreatorNick('');
                            }
                          }}
                          className="w-full mt-4 px-4 py-2.5 bg-gradient-to-r  from-blue-500 to-cyan-500 
                          hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-500 disabled:to-gray-600 
                          disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all 
                          duration-200 shadow-lg"
                        >
                          ✨ Создать комнату
                        </motion.button>

                        {/* Информационный блок */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="bg-white/5 border border-white/10 rounded-lg p-3 mt-4"
                        >
                          <p className="text-xs text-white/60">
                            💡 После создания вы получите уникальный ID, который сможете поделиться с друзьями
                          </p>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  )}
                  {selectedOption === 'create-room' && register_comnat === 'secured' && (
                    <motion.div
                      key="room-created"
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className="space-y-6 text-center"
                    >
                      {/* Анимированный значок */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="text-5xl"
                      >
                        ✨
                      </motion.div>

                      <motion.h3
                        className="text-2xl font-bold text-white"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        Комната создана!
                      </motion.h3>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-3"
                      >
                        <p className="text-white/70 text-sm">
                          <span className="font-semibold text-white">{createdRoomName}</span>
                        </p>

                        {/* Блок с ID */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 }}
                          className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/50 rounded-xl p-4 backdrop-blur-sm"
                        >
                          <p className="text-xs text-white/60 mb-2">ID комнаты</p>
                          <p className="text-lg font-mono font-bold text-cyan-300 break-all">
                            {createdRoomId}
                          </p>
                        </motion.div>

                        {/* Кнопка копирования */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            if (navigator.clipboard) {
                              navigator.clipboard.writeText(createdRoomId);
                            } else {
                              alert('ошибка при копировании')
                              return
                            }
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                          className="w-full px-4 py-2.5 mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg"
                        >
                          {copied ? '✓ Скопировано в буфер!' : '📋 Скопировать ID'}
                        </motion.button>

                        {/* Информационный блок */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                          className="bg-white/5 border border-white/10 rounded-lg p-3 mt-4"
                        >
                          <p className="text-xs text-white/60 leading-tight">
                            🔗 Поделитесь этим ID с друзьями, чтобы они присоединились к комнате
                          </p>
                        </motion.div>

                        {/* Кнопка закрытия */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setregister_comnat(null);
                            setSelectedOption(null);
                            setIsModalOpen(false);
                            setCreatedRoomId('');
                            setCreatedRoomName('');
                          }}
                          className="w-full px-4 py-2 mt-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all duration-200"
                        >
                          ← Вернуться в меню
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  )}
                  {selectedOption === 'create-room' && register_comnat === 'error' && (
                    <motion.div
                      key="room-error"
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className="space-y-6 text-center"
                    >
                      {/* Анимированный значок ошибки */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="text-5xl"
                      >
                        ❌
                      </motion.div>

                      <motion.h3
                        className="text-2xl font-bold text-red-300"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        Ошибка при создании комнаты
                      </motion.h3>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-4"
                      >
                        {/* Блок с текстом ошибки */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 }}
                          className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/50 rounded-xl p-4 backdrop-blur-sm"
                        >
                          <p className="text-xs text-white/60 mb-2">Сообщение об ошибке</p>
                          <p className="text-sm font-mono text-red-300 overflow-wrap:break-word">
                            {roomErrorMessage}
                          </p>
                        </motion.div>

                        {/* Информационный блок */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                          className="bg-white/5 border border-white/10 rounded-lg p-3 mt-4"
                        >
                          <p className="text-xs text-white/60 leading-tight">
                            ⚠️ Проверьте данные и попробуйте снова
                          </p>
                        </motion.div>

                        {/* Кнопка повтора */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setregister_comnat(null);
                            setRoomErrorMessage('');
                          }}
                          className="w-full px-4 py-2.5 mt-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all duration-200"
                        >
                          🔄 Попробовать снова
                        </motion.button>

                        {/* Кнопка закрытия */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setregister_comnat(null);
                            setSelectedOption(null);
                            setIsModalOpen(false);
                            setRoomErrorMessage('');
                          }}
                          className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all duration-200"
                        >
                          ← Вернуться в меню
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}