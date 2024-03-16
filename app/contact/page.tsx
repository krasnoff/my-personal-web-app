'use client'

export default function Contact() {
    return (
        <div className="mx-auto max-w-innerFrame">
            <div className="font-bold text-5xl pl-4 mt-4 mb-10">Contact page</div>
            <div className="flex pl-4 gap-x-5 mb-4">
                <div className="basis-1/2">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">
                            Full Name
                        </label>
                        <input className="text-field focus:shadow-outline focus:outline-pink-500" id="fullName" type="text" />
                        <div className="w-full text-center text-red-500 text-sm">Please enter full name</div>
                    </div>
                </div>
                <div className="basis-1/2">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input className="text-field focus:shadow-outline focus:outline-pink-500" id="email" type="text" />
                        <div className="w-full text-center text-red-500 text-sm">Please enter email</div>
                    </div>
                </div>
            </div>
            <div className="flex pl-4 mb-4">
                <div className="w-full">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                        Message
                    </label>
                    <textarea className="text-field focus:shadow-outline focus:outline-pink-500 resize-none w-full h-24" id="message" />
                    <div className="w-full text-center text-red-500 text-sm">Please enter message</div>
                </div>
            </div>
            <div className="flex pl-4">
                <button className="primary-button">Send Message</button>
            </div>
        </div>
    )
}