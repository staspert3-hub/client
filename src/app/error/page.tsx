'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './error.module.css';

export default function ErrorPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.errorCode}>
                    <span className={styles.digit}>4</span>
                    <div className={styles.orb}></div>
                    <span className={styles.digit}>4</span>
                </div>

                <h1 className={styles.title}>Доступ запрещён</h1>
                <p className={styles.description}>
                    Ошибка: вы не были допущены к этому чату. Попросите администратора чата добавить вас в список участников.
                </p>

                <div className={styles.floatingElements}>
                    <div className={styles.shape + ' ' + styles.shape1}></div>
                    <div className={styles.shape + ' ' + styles.shape2}></div>
                    <div className={styles.shape + ' ' + styles.shape3}></div>
                </div>

                <div className={styles.buttonsContainer}>
                    <Link href="/" className={styles.button + ' ' + styles.primaryButton}>
                        <span className={styles.buttonText}>Вернуться на главную</span>
                        <span className={styles.buttonArrow}>→</span>
                    </Link>
                </div>

                <div className={styles.particles}>
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className={styles.particle}
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                animationDuration: `${3 + Math.random() * 4}s`,
                            }}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
}
