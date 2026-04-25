'use client';

import { useEffect, useState } from 'react';
import styles from './ChatSettings.module.css';
import { json } from 'node:stream/consumers';
import { API } from '@/lib/API';

interface AllowedUser {
    id: string;
    username: string;
}

interface ChatSettingsProps {
    roomName: string;
}

type SettingTab = 'menu' | 'users' | 'general';

// Заглушки функций

async function removeUserFromChat(roomName: string, userId: string) {
    console.log(`Removing user ${userId} from room ${roomName}`);
    // TODO: Реализовать удаление пользователя с сервера
}

export default function ChatSettings({ roomName }: ChatSettingsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentTab, setCurrentTab] = useState<SettingTab>('menu');
    const [allowedUsers, setAllowedUsers] = useState<AllowedUser[]>([]);
    const [showAddInput, setShowAddInput] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleOpenModal = async () => {
        setIsOpen(true);
        setCurrentTab('menu');
    };

    const handleCloseModal = () => {
        setIsOpen(false);
        setShowAddInput(false);
        setNewUsername('');
    };

    const handleSelectTab = async (tab: SettingTab) => {
        setCurrentTab(tab);
        if (tab === 'users') {
            setIsLoading(true);
            try {
                const res = await fetch(`${API.api}/chat/users_chat`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        room_id: roomName
                    })
                })
                const j = await res.json()
                if (j.s) throw ('комнаты нету')
                setIsLoading(false)
                console.log(j)
                setAllowedUsers(j.users)
            } catch (e) {
                alert('ошибочка при запросе')
                console.error(e)
            }
        }
    };

    const handleAddUser = async (id: string) => {
        if (!newUsername.trim()) {
            alert('Пожалуйста, введите никнейм пользователя');
            return;
        }

        try {
            const res = await fetch(`${API.api}/chat/add_user_chat`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    room_id: roomName,
                    id: newUsername
                })
            })
            const j = await res.json()
            if (j.s === false) throw ('попа')
            const s = {
                username: newUsername,
                id: j.id
            }
            setNewUsername('')
            setAllowedUsers((p => [...p as any, s]))
            setShowAddInput(false)
        } catch (error) {
            console.error('Ошибка при добавлении пользователя:', error);
            alert('Не удалось добавить пользователя');
        }
    };

    useEffect(() => {
        console.log(allowedUsers)
    }, [allowedUsers])

    const handleRemoveUser = async (userId: string) => {
        try {
            const res = await fetch(`${API.api}/chat/delete_user_chat`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    room_id: roomName,
                    id: userId
                })
            })
            const j = await res.json()
            if (j.s === false) throw ('попа')
            if (allowedUsers !== undefined) {
                setAllowedUsers(p => p.filter(name => name.id !== userId))
            } else {
                alert("ошибка типов")
            }
        } catch (error) {
            console.error('Ошибка при удалении пользователя:', error);
            alert('Не удалось удалить пользователя');
        }
    };

    return (
        <>
            <button
                className={styles.settingsButton}
                onClick={handleOpenModal}
                title="Настройки чата"
            >
                ⚙️
            </button>

            {isOpen && (
                <div className={styles.modalOverlay} onClick={handleCloseModal}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            {currentTab !== 'menu' && (
                                <button
                                    className={styles.backButton}
                                    onClick={() => setCurrentTab('menu')}
                                >
                                    ←
                                </button>
                            )}
                            <h2 className={styles.modalTitle}>Настройки чата</h2>
                            <button
                                className={styles.closeButton}
                                onClick={handleCloseModal}
                            >
                                ✕
                            </button>
                        </div>

                        <div className={styles.modalContent}>
                            {currentTab === 'menu' && (
                                <div className={`${styles.section} ${styles.menuSection}`}>
                                    <button
                                        className={styles.menuItem}
                                        onClick={() => handleSelectTab('users')}
                                    >
                                        <span className={styles.menuIcon}>👥</span>
                                        <div className={styles.menuText}>
                                            <span className={styles.menuTitle}>Разрешённые пользователи</span>
                                            <span className={styles.menuDesc}>Управление доступом к чату</span>
                                        </div>
                                        <span className={styles.menuArrow}>→</span>
                                    </button>

                                    <button
                                        className={styles.menuItem}
                                        onClick={() => handleSelectTab('general')}
                                    >
                                        <span className={styles.menuIcon}>⚙️</span>
                                        <div className={styles.menuText}>
                                            <span className={styles.menuTitle}>Общие настройки</span>
                                            <span className={styles.menuDesc}>Настройки чата</span>
                                        </div>
                                        <span className={styles.menuArrow}>→</span>
                                    </button>
                                </div>
                            )}

                            {currentTab === 'users' && (
                                <div className={`${styles.section} ${styles.fadeIn}`}>
                                    <h3 className={styles.sectionTitle}>Разрешённые пользователи</h3>

                                    {isLoading ? (
                                        <div className={styles.loading}>Загрузка...</div>
                                    ) : (
                                        <>
                                            <div className={styles.usersList}>
                                                {allowedUsers && allowedUsers.map((user) => (
                                                    <div key={user.id} className={styles.userItem}>
                                                        <span className={styles.username}>{user.username}</span>
                                                        <button
                                                            className={styles.removeButton}
                                                            onClick={() => handleRemoveUser(user.id)}
                                                            title="Удалить пользователя"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className={styles.addUserSection}>
                                                {!showAddInput ? (
                                                    <button
                                                        className={styles.addButton}
                                                        onClick={() => setShowAddInput(true)}
                                                    >
                                                        <span className={styles.plusIcon}>+</span>
                                                        Добавить пользователя
                                                    </button>
                                                ) : (
                                                    <div className={styles.inputContainer}>
                                                        <input
                                                            type="text"
                                                            className={styles.usernameInput}
                                                            placeholder="Введите никнейм"
                                                            value={newUsername}
                                                            onChange={(e) => setNewUsername(e.target.value)}
                                                            onKeyPress={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    handleAddUser(newUsername);
                                                                }
                                                            }}
                                                            autoFocus
                                                        />
                                                        <button
                                                            className={styles.confirmButton}
                                                            onClick={() => handleAddUser(newUsername)}
                                                        >
                                                            ✓
                                                        </button>
                                                        <button
                                                            className={styles.cancelButton}
                                                            onClick={() => {
                                                                setShowAddInput(false);
                                                                setNewUsername('');
                                                            }}
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {currentTab === 'general' && (
                                <div className={`${styles.section} ${styles.fadeIn}`}>
                                    <h3 className={styles.sectionTitle}>Общие настройки</h3>
                                    <div className={styles.generalSettings}>
                                        <div className={styles.settingItem}>
                                            <span>Уведомления</span>
                                            <input type="checkbox" defaultChecked />
                                        </div>
                                        <div className={styles.settingItem}>
                                            <span>Пины сообщений</span>
                                            <input type="checkbox" defaultChecked />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
