'use client'

import { SubmitHandler, useForm } from "react-hook-form";

interface IFormInput {
    fullName: string;
    email: string;
    message: string;
}

export default function Contact() {
    const { register, formState: { errors }, handleSubmit } = useForm<IFormInput>();
    const onSubmit: SubmitHandler<IFormInput> = data => console.log(data);
    
    return (
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
    )
}