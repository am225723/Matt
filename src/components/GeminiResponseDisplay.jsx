import React from "react";
import { motion } from "framer-motion";
import { ClipboardCopy, Star, Zap, CheckCircle } from "lucide-react";
import html2pdf from "html2pdf.js";

const handleCopy = (text) => {
	navigator.clipboard.writeText(text);
};

export const handlePrintToPDF = (responses, summary) => {
	try {
		// Ensure responses is an array and handle edge cases
		const safeResponses = Array.isArray(responses) ? responses : [];
		const safeSummary = summary || "";
		
		const content = `
	      <div style="font-family:sans-serif; padding:20px;">
	        <h2>🏌️ Ryder Cup Yardage Book</h2>
	        ${safeResponses
				.map(
					(res, i) =>
						`<h3>Hole ${i + 1}</h3><p>${res || "No response."}</p><hr/>`
				)
				.join("")}
	        ${safeSummary ? `<h2>🧠 AI Summary</h2><p>${safeSummary}</p>` : ""}
	      </div>
	    `;
		const element = document.createElement("div");
		element.innerHTML = content;
		html2pdf()
			.set({
				margin: 0.5,
				filename: "ryder-cup-yardage-book.pdf",
				html2canvas: { scale: 2 },
				jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
			})
			.from(element)
			.save();
	} catch (error) {
		console.error("Error generating PDF:", error);
		// In a real implementation, we would show a user-friendly error message
	}
};

export const handleEnhancedPrintToPDF = (holes, responses, insights, summary) => {
	try {
		// Ensure responses is an array and handle edge cases
		const safeResponses = Array.isArray(responses) ? responses : [];
		const safeInsights = Array.isArray(insights) ? insights : [];
		const safeSummary = summary || "";
		
		const content = `
	      <div style="font-family: Arial, sans-serif; padding: 25px; color: #333;">
	        <style>
	          @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Roboto:wght@400;500&display=swap');
	          body { font-family: 'Roboto', sans-serif; }
	          h1, h2, h3, h4 { font-family: 'Merriweather', serif; }
	          h2 { color: #1a73e8; }
	          h3 { color: #34a853; border-bottom: 2px solid #eee; padding-bottom: 5px; }
	          .hole-container { page-break-inside: avoid; margin-bottom: 25px; border: 1px solid #ddd; border-radius: 8px; padding: 15px; background-color: #f9f9f9; }
	          .prompt { font-style: italic; color: #5f6368; margin-bottom: 10px; }
	          .response { background-color: #fff; padding: 10px; border-radius: 4px; border: 1px solid #e0e0e0; }
	          .insight { background-color: #e8f0fe; padding: 15px; border-left: 4px solid #1a73e8; margin-top: 15px; border-radius: 4px; }
	          .insight h4 { color: #1967d2; margin-top: 0; margin-bottom: 5px; }
	          hr { border: 0; border-top: 1px solid #eee; margin: 20px 0; }
	        </style>
	        <h2 style="text-align: center; border-bottom: 2px solid #1a73e8; padding-bottom: 10px;">🏌️ Enhanced Ryder Cup Yardage Book</h2>
	        ${holes
				.map(
					(hole, i) => `
	                <div class="hole-container">
	                  <h3>${hole.title}</h3>
	                  <p class="prompt">"${hole.prompt}"</p>
	                  <div class="response">
	                    <strong>Your Answer:</strong>
	                    <p>${safeResponses[i] || "No response."}</p>
	                  </div>
	                  ${safeInsights && safeInsights[i] ? 
	                    `<div class="insight">
	                      <h4>🧠 AI Caddie's Insight</h4>
	                      <p>${safeInsights[i].replace(/\n/g, '<br>')}</p>
	                    </div>` : 
	                    ''}
	                </div>
	              `
				)
				.join("")}
	        ${safeSummary ? `
	          <div style="page-break-before: always;">
	            <h2 style="color: #34a853;">⭐ Your Final Yardage Book Summary</h2>
	            <p>${safeSummary.replace(/\n/g, '<br>')}</p>
	          </div>` : ""}
	      </div>
	    `;
		const element = document.createElement("div");
		element.innerHTML = content;
		html2pdf()
			.set({
				margin: 0.5,
				filename: "enhanced-ryder-cup-yardage-book.pdf",
				html2canvas: { scale: 2, useCORS: true },
				jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
			})
			.from(element)
			.save();
	} catch (error) {
		console.error("Error generating enhanced PDF:", error);
		// In a real implementation, we would show a user-friendly error message
	}
};

const InsightCard = ({ title, text, icon, index, children }) => {
	const IconComponent = icon || Zap;
	return (
		<motion.div
			initial={{ opacity: 0, y: 20, scale: 0.95 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
			className="relative bg-gradient-to-br from-white/10 to-white/5 glass rounded-xl overflow-hidden shadow-lg border border-white/20"
		>
			<div className="p-5 space-y-3">
				<button
					className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors"
					onClick={() => handleCopy(title ? `${title}\n${text}` : text)}
				>
					<ClipboardCopy size={16} />
				</button>

				{title && (
					<div className="flex items-center mb-1">
						<IconComponent className="w-5 h-5 text-cyan-300 mr-3" />
						<h4 className="font-bold text-lg text-white tracking-wide">
							{title}
						</h4>
					</div>
				)}

				{text && (
					<p
						className={`text-white/80 whitespace-pre-wrap text-sm leading-relaxed ${title ? "pl-8" : ""
							}`}
					>
						{text}
					</p>
				)}

				{/* 🧩 Child content goes here (conversation box, reset button, etc.) */}
				{children}
			</div>
		</motion.div>
	);
};

const formatGeminiResponse = (responseText, children) => {
	if (!responseText || typeof responseText !== "string") {
		// Still render children in a card if provided
		return children ? (
			<InsightCard key={0} index={0}>
				{children}
			</InsightCard>
		) : null;
	}

	const blocks = responseText.split(/\n{2,}/);
	const cards = [];
	let cardIndex = 0;

	blocks.forEach((block) => {
		const titleMatch = block.match(/^\s*\*+\s*(.*?)\s*\*+\s*$/);
		if (titleMatch) {
			const title = titleMatch[1];
			const contentAfterTitle = block.substring(titleMatch[0].length).trim();
			cards.push(
				<InsightCard
					title={title}
					text={contentAfterTitle}
					key={cardIndex}
					index={cardIndex++}
					icon={Star}
				>
					{children}
				</InsightCard>
			);
		} else if (block.match(/^\s*(\d+\.|\*|-)\s/)) {
			const listItems = block
				.split(/\n\s*(?:\d+\.|\*|-)\s/)
				.filter((item) => item.trim());
			listItems.forEach((item) => {
				cards.push(
					<InsightCard
						text={item.trim()}
						key={cardIndex}
						index={cardIndex++}
						icon={CheckCircle}
					>
						{children}
					</InsightCard>
				);
			});
		} else {
			cards.push(
				<InsightCard text={block.trim()} key={cardIndex} index={cardIndex++}>
					{children}
				</InsightCard>
			);
		}
	});

	return cards.length > 0 ? cards : [<InsightCard text={responseText} key={0} index={0}>{children}</InsightCard>];
};

const GeminiResponseDisplay = ({ responseText, title = "AI-Powered Coaching Insights", children }) => {
	return (
		<div className="mt-6 space-y-4">
			<h3 className="text-xl font-bold text-white/90 flex items-center gap-2 px-1 tracking-wider">
				🎯 {title}
			</h3>
			<div className="space-y-4">
				{formatGeminiResponse(responseText, children)}
			</div>
		</div>
	);
};

export default GeminiResponseDisplay;