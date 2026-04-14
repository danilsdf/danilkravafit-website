export default function Contact() {
	return (
		<>
			<section className="w-full flex flex-col items-center justify-center py-16 px-4">
				<h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-neutral-900 dark:text-neutral-50">Contact</h1>
				<div className="max-w-xl w-full mx-auto space-y-8">
					<div className="text-lg text-neutral-700 dark:text-neutral-300 text-center">
						<p>Feel free to reach out for collaborations, questions, or just to say hi!</p>
						<p className="mt-2">Email: <a href="mailto:danil@example.com" className="underline hover:opacity-70">danil@example.com</a></p>
					</div>
					<form className="bg-white/80 dark:bg-neutral-900/60 rounded-lg p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col gap-4">
						<input
							type="text"
							name="name"
							placeholder="Your Name"
							className="px-4 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
							required
						/>
						<input
							type="email"
							name="email"
							placeholder="Your Email"
							className="px-4 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
							required
						/>
						<textarea
							name="message"
							placeholder="Your Message"
							rows={5}
							className="px-4 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
							required
						/>
						<button
							type="submit"
							className="mt-2 px-6 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
						>
							Send Message
						</button>
					</form>
				</div>
			</section>
		</>
	);
}
