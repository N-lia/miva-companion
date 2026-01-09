'use client';

import { useState, KeyboardEvent, useEffect } from 'react';
import Lottie from 'lottie-react';
import { COURSES } from '../constants/courses';
import {
    BookOpen,
    GraduationCap,
    Pencil,
    ChevronRight,
    ChevronLeft,
    CheckCircle2,
    Lightbulb,
    Search
} from 'lucide-react';

export default function RegistrationForm() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        confidentCourses: [] as string[],
        helpCourses: [] as string[]
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [animationData, setAnimationData] = useState<any>(null);

    useEffect(() => {
        fetch('/animations/matchmaking.json')
            .then(res => res.json())
            .then(data => setAnimationData(data))
            .catch(err => console.error('Failed to load animation:', err));
    }, []);

    const handleNext = () => {
        if (step === 1 && !formData.name.trim()) return;
        if (step === 2 && formData.confidentCourses.length === 0) return;
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && formData.name.trim()) {
            handleNext();
        }
    };

    const toggleCourse = (course: string, type: 'confident' | 'help') => {
        setFormData(prev => {
            const list = type === 'confident' ? prev.confidentCourses : prev.helpCourses;
            const newList = list.includes(course)
                ? list.filter(c => c !== course)
                : [...list, course];

            return {
                ...prev,
                [type === 'confident' ? 'confidentCourses' : 'helpCourses']: newList
            };
        });
    };

    const handleSubmit = async () => {
        setStatus('submitting');
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('Registration failed');

            setStatus('success');
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="w-full max-w-2xl mx-auto bg-white/80 backdrop-blur-xl p-8 md:p-16 rounded-[2.5rem] shadow-xl text-center border border-white/20 animate-in zoom-in duration-500">
                <div className="w-48 h-48 mx-auto mb-8">
                    {animationData && <Lottie animationData={animationData} loop={true} />}
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">Matchmaking in Progress...</h2>
                <p className="text-gray-600 text-lg md:text-xl mb-8 leading-relaxed max-w-lg mx-auto">
                    Our algorithm is currently analyzing your academic profile to find the most compatible <span className="text-blue-600 font-bold">study buddy</span> for your goals.
                </p>
                <div className="flex flex-col items-center gap-4">
                    <div className="px-6 py-3 bg-blue-50 text-blue-700 rounded-2xl text-sm font-bold flex items-center gap-2 animate-pulse">
                        <Search className="w-4 h-4" />
                        Scanning for Accountability Partners
                    </div>
                    <p className="text-400 text-sm italic">
                        We will contact you as soon as a match is finalized.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto bg-white p-6 md:p-12 rounded-[2.5rem] shadow-xl border border-gray-100 relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -z-10" />

            {/* Progress Bar */}
            <div className="flex justify-between mb-12 relative px-2">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10 rounded-full" />
                {[1, 2, 3].map((s) => (
                    <div
                        key={s}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all duration-500 ${step >= s
                            ? 'bg-blue-600 text-white shadow-md scale-105'
                            : 'bg-white text-gray-400 border-2 border-gray-100'
                            }`}
                    >
                        {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
                    </div>
                ))}
            </div>

            <div className="min-h-[380px] flex flex-col">
                {step === 1 && (
                    <div className="flex-1 flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <GraduationCap className="w-6 h-6 text-blue-600" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Welcome!</h2>
                        </div>
                        <p className="text-gray-500 text-lg mb-10">Let's get started. What's your name?</p>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            onKeyDown={handleKeyDown}
                            className="w-full text-2xl md:text-4xl font-bold border-b-4 border-gray-100 py-6 focus:outline-none focus:border-blue-600 transition-all bg-transparent placeholder-gray-200"
                            placeholder="Full Name"
                            autoFocus
                        />
                    </div>
                )}

                {step === 2 && (
                    <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-indigo-50 rounded-lg">
                                <BookOpen className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Strong Suits</h2>
                        </div>
                        <p className="text-gray-500 mb-8">Select the courses you feel confident teaching others.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                            {COURSES.map(course => (
                                <button
                                    key={course}
                                    onClick={() => toggleCourse(course, 'confident')}
                                    className={`p-5 rounded-2xl text-left transition-all border-2 flex items-center justify-between group ${formData.confidentCourses.includes(course)
                                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-sm'
                                        : 'border-gray-100 hover:border-blue-200 text-gray-600 bg-gray-50/50'
                                        }`}
                                >
                                    <span className="truncate">{course}</span>
                                    {formData.confidentCourses.includes(course) && <Lightbulb className="w-4 h-4 text-blue-600 animate-pulse" />}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-pink-50 rounded-lg">
                                <Pencil className="w-6 h-6 text-pink-600" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Needs Help</h2>
                        </div>
                        <p className="text-gray-500 mb-8">Select the courses you need support with.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                            {COURSES.filter(c => !formData.confidentCourses.includes(c)).map(course => (
                                <button
                                    key={course}
                                    onClick={() => toggleCourse(course, 'help')}
                                    className={`p-5 rounded-2xl text-left transition-all border-2 flex items-center justify-between group ${formData.helpCourses.includes(course)
                                        ? 'border-pink-500 bg-pink-50 text-pink-700 font-bold shadow-sm'
                                        : 'border-gray-100 hover:border-pink-200 text-gray-600 bg-gray-50/50'
                                        }`}
                                >
                                    <span className="truncate">{course}</span>
                                    {formData.helpCourses.includes(course) && <Lightbulb className="w-4 h-4 text-pink-600 animate-pulse" />}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row justify-between mt-12 gap-4">
                <button
                    onClick={handleBack}
                    className={`flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all ${step === 1
                        ? 'opacity-0 pointer-events-none'
                        : 'text-gray-500 hover:bg-gray-100 active:scale-95'
                        }`}
                >
                    <ChevronLeft className="w-5 h-5" />
                    Back
                </button>

                {step < 3 ? (
                    <button
                        onClick={handleNext}
                        disabled={
                            (step === 1 && !formData.name.trim()) ||
                            (step === 2 && formData.confidentCourses.length === 0)
                        }
                        className="flex items-center justify-center gap-2 px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-30 disabled:grayscale shadow-md"
                    >
                        Next Step
                        <ChevronRight className="w-5 h-5" />
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={status === 'submitting' || formData.helpCourses.length === 0}
                        className="flex items-center justify-center gap-2 px-10 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all active:scale-95 disabled:opacity-30 shadow-md"
                    >
                        {status === 'submitting' ? (
                            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                Complete
                                <CheckCircle2 className="w-5 h-5" />
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
