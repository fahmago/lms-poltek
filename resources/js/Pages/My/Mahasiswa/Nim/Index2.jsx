import { Inertia } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/inertia-react';
import React, { useState, useEffect, useRef } from 'react';
import MyLayout from '../../../../Layouts/MyLayout';
import ButtonSave from '../../../../Shared/ButtonSave';
import ToastNotification from '../../../../Shared/ToastNotification';
import InputField from '../../../../Shared/Fields/InputField';

const Index = () => {
    const { errors } = usePage().props;

    const [nim, setNim] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [nimError, setNimError] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [shake, setShake] = useState(false);
    const [lastLength, setLastLength] = useState(0);

    const nimRef = useRef(null);

    /* 🔊 SOUND */
    const errorSound = new Audio('/sounds/error.mp3');
    const successSound = new Audio('/sounds/success.mp3');

    /* =========================
       VALIDASI + SOUND
    ========================== */
    useEffect(() => {
        if (nim.length === 12 && lastLength !== 12) {
            successSound.play();
            setIsValid(true);
            setNimError('');
        } else if (nim && nim.length < 12) {
            setIsValid(false);
            setNimError('NIM harus 12 digit angka');
        } else {
            setNimError('');
            setIsValid(false);
        }

        setLastLength(nim.length);
    }, [nim]);

    /* =========================
       SHAKE + ERROR SOUND
    ========================== */
    const triggerError = () => {
        setShake(true);
        errorSound.play();
        setTimeout(() => setShake(false), 400);
    };

    /* =========================
       BLOCK NON ANGKA
    ========================== */
    const handleKeyDown = (e) => {
        const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];

        if (!/[0-9]/.test(e.key) && !allowed.includes(e.key)) {
            e.preventDefault();
            triggerError();
        }
    };

    /* =========================
       SUBMIT
    ========================== */
    const storeRegistrasiMahasiswa = (e) => {
        e.preventDefault();

        if (!isValid) {
            triggerError();
            nimRef.current?.focus();
            return;
        }

        setIsLoading(true);

        Inertia.post(
            route('mhs.nim.store'),
            { nim, password },
            {
                onSuccess: () => {
                    ToastNotification({
                        icon: 'success',
                        title: 'NIM berhasil diperbarui!',
                        timer: 2000,
                    });
                    setNim('');
                    setPassword('');
                },
                onFinish: () => setIsLoading(false),
            }
        );
    };

    /* =========================
       UI HELPERS
    ========================== */
    const progress = Math.min((nim.length / 12) * 100, 100);

    const progressColor =
        nim.length === 12
            ? '#22c55e'
            : nim.length === 11
                ? '#f59e0b'
                : '#ef4444';

    const inputClass =
        shake
            ? 'nim-error'
            : nim.length === 12
                ? 'nim-valid'
                : nim.length === 11
                    ? 'nim-warning'
                    : '';

    return (
        <>
            <Head>
                <title>eLearning - Update NIM Mahasiswa</title>
            </Head>

            <MyLayout>
                <style>{`
                    @keyframes shake {
                        0% { transform: translateX(0); }
                        25% { transform: translateX(-5px); }
                        50% { transform: translateX(5px); }
                        75% { transform: translateX(-5px); }
                        100% { transform: translateX(0); }
                    }

                    .nim-error input {
                        border-color: #ef4444 !important;
                        animation: shake 0.4s;
                    }

                    .nim-warning input {
                        border-color: #f59e0b !important;
                    }

                    .nim-valid input {
                        border-color: #22c55e !important;
                    }

                    .progress-bar {
                        height: 8px;
                        border-radius: 999px;
                        background: #e5e7eb;
                        overflow: hidden;
                    }

                    .progress-fill {
                        height: 100%;
                        transition: width 0.3s ease;
                    }
                `}</style>

                <div className="">
                    <div className="bg-white shadow-sm rounded-md">
                        <div className="bg-blue-600 p-4 rounded-t-md text-white font-bold">
                            <i className="fa fa-id-card-clip mr-2"></i>
                            Update NIM Mahasiswa
                        </div>

                        <div className="p-6">
                            <form onSubmit={storeRegistrasiMahasiswa} autoComplete="off">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    {/* NIM */}
                                    <div ref={nimRef} className={inputClass}>
                                        <InputField
                                            label="NIM Mahasiswa"
                                            type="text"
                                            value={nim}
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            maxLength={12}
                                            autoComplete="off"
                                            onKeyDown={handleKeyDown}
                                            onChange={(e) =>
                                                setNim(e.target.value.replace(/\D/g, ''))
                                            }
                                            onPaste={(e) => e.preventDefault()}
                                            onCopy={(e) => e.preventDefault()}
                                            onCut={(e) => e.preventDefault()}
                                            onContextMenu={(e) => e.preventDefault()}
                                            placeholder="Masukkan 12 digit NIM"
                                            error={nimError || errors.nim}
                                        />

                                        {/* 📊 PROGRESS */}
                                        <div className="mt-2">
                                            <div className="progress-bar">
                                                <div
                                                    className="progress-fill"
                                                    style={{
                                                        width: `${progress}%`,
                                                        background: progressColor,
                                                    }}
                                                />
                                            </div>
                                            <div className="text-xs mt-1 text-gray-600">
                                                {nim.length}/12 digit
                                            </div>
                                        </div>
                                    </div>

                                    {/* PASSWORD */}
                                    <InputField
                                        label="Password"
                                        type="password"
                                        value={password}
                                        autoComplete="new-password"
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Masukkan Password"
                                        error={errors.password}
                                    />
                                </div>

                                {/* BUTTON */}
                                <div className="mt-4">
                                    <ButtonSave
                                        type="submit"
                                        disabled={!isValid || isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <i className="fa fa-spinner fa-spin mr-2"></i>
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa fa-save mr-2"></i>
                                                Update
                                            </>
                                        )}
                                    </ButtonSave>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </MyLayout>
        </>
    );
};

export default Index;
