'use client'

import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import { Fragment, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Hourglass } from "react-loader-spinner";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface IFormInput {
    fullName: string;
    email: string;
    message: string;
}

export default function Contact() {
    let [isOpen, setIsOpen] = useState(false)
    const { register, formState: { errors }, handleSubmit, reset } = useForm<IFormInput>();
    const onSubmit: SubmitHandler<IFormInput> = async data => {
        console.log(data);
        openModal();
        axios.post('/api/mailer', {submissionObject: data})
        .then((response) => {
            if (response.status === 200) {
                formReset();
                toast.success("Send successful");
            } else {
                throw(response);
            }
        }).catch((error: any) => {
            console.log('Error in sending mail', error);
            toast.error("Error in sending");
        }).finally(() => {
            closeModal();
        });
    };

    const formReset = () => {
        reset({
            fullName: '',
            email: '',
            message: ''
        });
    }

    const closeModal = () => {
        setIsOpen(false)
    }
    
    const openModal = () => {
        setIsOpen(true)
    }
    
    return (
        <>
            <form className="mx-auto max-w-innerFrame" onSubmit={handleSubmit(onSubmit)}>
                <div className="font-bold text-5xl pl-4 mt-4 mb-10">Contact page</div>
                <div className="flex pl-4 gap-x-5 mb-4">
                    <div className="basis-1/2">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">
                                Full Name
                            </label>
                            <input className="text-field focus:shadow-outline focus:outline-pink-500" id="fullName" type="text" {...register("fullName", { required: true })} />
                            {errors.fullName?.type === 'required' && <div className="w-full text-center text-red-500 text-sm">Please enter full name</div>}
                        </div>
                    </div>
                    <div className="basis-1/2">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input className="text-field focus:shadow-outline focus:outline-pink-500" id="email" type="text" {...register("email", { required: true, pattern: /^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/i})} />
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
                        <textarea className="text-field focus:shadow-outline focus:outline-pink-500 resize-none w-full h-24" id="message" {...register("message", { required: true })} />
                        {errors.message?.type === 'required' && <div className="w-full text-center text-red-500 text-sm">Please enter message</div>}
                    </div>
                </div>
                <div className="flex pl-4">
                    <button className="primary-button" type="submit">Send Message</button>
                </div>
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