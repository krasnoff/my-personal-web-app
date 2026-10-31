'use client'

import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Hourglass } from "react-loader-spinner";
import { ToastContainer, toast } from 'react-toastify';
// @ts-expect-error The package stylesheet has no TypeScript declarations.
import 'react-toastify/dist/ReactToastify.css';
import { registerWebMCPTool } from "@/lib/webmcp";
import JsonLd from "@/components/jsonLd";
import { PERSON_ID, SITE_URL, WEBSITE_ID } from "@/lib/schema";

interface IFormInput {
    fullName: string;
    email: string;
    message: string;
}

export default function Contact() {
    let [isOpen, setIsOpen] = useState(false)
    const sending = useRef(false);
    const { register, formState: { errors }, handleSubmit, reset, setValue } = useForm<IFormInput>();
    const sendMessage = useCallback(async (data: IFormInput, signal?: AbortSignal) => {
        if (sending.current) return { success: false, error: "A message is already being sent. Wait for its result." };
        signal?.throwIfAborted();
        sending.current = true;
        setIsOpen(true);
        try {
            await axios.post('/api/mailer', { submissionObject: data }, { signal });
            reset({ fullName: '', email: '', message: '' });
            toast.success("Send successful");
            return { success: true, message: "Your contact message was sent successfully." };
        } catch (error) {
            if (signal?.aborted) throw error;
            toast.error("Error in sending");
            return { success: false, error: "Email submission failed. Your message remains in the form. Delivery could not be confirmed." };
        } finally {
            sending.current = false;
            setIsOpen(false);
        }
    }, [reset]);

    useEffect(() => registerWebMCPTool({
        name: "send_contact_message",
        description: "Fill the contact form and submit it to send an email to Kobi Krasnoff. Use when the user asks to send a contact message. This sends a real email.",
        inputSchema: {
            type: "object",
            properties: {
                fullName: { type: "string", minLength: 1, description: "The sender's full name." },
                email: { type: "string", format: "email", description: "The sender's email address for replies." },
                message: { type: "string", minLength: 1, description: "The message to send." },
            },
            required: ["fullName", "email", "message"],
            additionalProperties: false,
        },
        annotations: { readOnlyHint: false, consequentialHint: true },
        execute: async (input, options) => {
            if (sending.current) return { success: false, error: "A message is already being sent. Wait for its result." };
            options?.signal?.throwIfAborted();
            if (!input || typeof input !== 'object' || Array.isArray(input)) {
                return { success: false, error: "Provide fullName, email, and message as strings." };
            }
            const values = input as Record<string, unknown>;
            const fields = ['fullName', 'email', 'message'] as const;
            if (fields.some(field => typeof values[field] !== 'string') || Object.keys(values).some(key => !fields.includes(key as typeof fields[number]))) {
                return { success: false, error: "Provide only fullName, email, and message as strings." };
            }
            fields.forEach(field => setValue(field, (values[field] as string).trim(), { shouldDirty: true, shouldTouch: true }));
            let result: { success: boolean; message?: string; error?: string } = { success: false, error: "Form validation failed." };
            await handleSubmit(
                async data => { result = await sendMessage(data, options?.signal); },
                invalid => { result = { success: false, error: `Please correct: ${Object.keys(invalid).join(', ')}.` }; },
            )();
            return result;
        },
    }), [handleSubmit, setValue, sendMessage]);

    const closeModal = () => {
        setIsOpen(false)
    }
    
    return (
        <>
            <title>Kobi Krasnoff - Contact me</title>
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "ContactPage",
                    "@id": `${SITE_URL}/contact#page`,
                    url: `${SITE_URL}/contact`,
                    name: "Contact Kobi Krasnoff",
                    isPartOf: { "@id": WEBSITE_ID },
                    about: { "@id": PERSON_ID },
                }}
            />
            <form className="mx-auto max-w-innerFrame pr-5 sm:pr-0" onSubmit={handleSubmit(async data => { await sendMessage(data); })}>
                <h1 className="font-bold text-5xl pl-4 mt-4 mb-10">Contact page</h1>
                <div className="flex pl-4 gap-x-5 mb-4 flex-col sm:flex-row gap-y-5 sm:gap-y-0">
                    <div className="sm:basis-1/2">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">
                                Full Name
                            </label>
                            <input className="text-field focus:shadow-outline focus:outline-pink-500" id="fullName" type="text" {...register("fullName", { required: true, validate: value => value.trim().length > 0 })} />
                            {errors.fullName && <div className="w-full text-center text-red-500 text-sm">Please enter full name</div>}
                        </div>
                    </div>
                    <div className="sm:basis-1/2">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input className="text-field focus:shadow-outline focus:outline-pink-500" id="email" type="email" {...register("email", { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/})} />
                            {errors.email?.type === 'required' && <div className="w-full text-center text-red-500 text-sm">Please enter email</div>}
                            {errors.email?.type === 'pattern' && <div className="w-full text-center text-red-500 text-sm">Email is not valid</div>}
                        </div>
                    </div>
                </div>
                <div className="flex pl-4 mb-4">
                    <div className="w-full">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                            Message
                        </label>
                        <textarea className="text-field focus:shadow-outline focus:outline-pink-500 resize-none w-full h-24" id="message" {...register("message", { required: true, validate: value => value.trim().length > 0 })} />
                        {errors.message && <div className="w-full text-center text-red-500 text-sm">Please enter message</div>}
                    </div>
                </div>
                <div className="flex pl-4">
                    <button className="primary-button" type="submit" disabled={isOpen}>Send Message</button>
                </div>
                {/* Send Email to: <a href="mailto:krasnoff.kobi@gmail.com">krasnoff.kobi@gmail.com</a> */}
            </form>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <Dialog.Title
                            as="h3"
                            className="text-lg font-medium leading-6 text-gray-900"
                        >
                            Please Wait...
                        </Dialog.Title>
                        <div className="mt-2 flex justify-center">
                            <Hourglass
                                visible={true}
                                height="80"
                                width="80"
                                ariaLabel="hourglass-loading"
                                wrapperStyle={{}}
                                wrapperClass=""
                                colors={['#306cce', '#72a1ed']}
                            />
                        </div>
                        </Dialog.Panel>
                    </Transition.Child>
                    </div>
                </div>
                </Dialog>
            </Transition>

            <ToastContainer position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light" />
        </>
    )
}
