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

export const handleEnhancedPrintToPDF = (responses, insights, summary) => {
	try {
		// Ensure responses is an array and handle edge cases
		const safeResponses = Array.isArray(responses) ? responses : [];
		const safeInsights = Array.isArray(insights) ? insights : [];
		const safeSummary = summary || "";
		
		const content = `
	      <div style="font-family:sans-serif; padding:20px;">
	        <h2>🏌️ Enhanced Ryder Cup Yardage Book</h2>
	        ${safeResponses
				.map(
					(res, i) => `
	                <div style="margin-bottom: 20px; page-break-inside: avoid;">
	                  <h3>Hole ${i + 1}</h3>
	                  <p>${res || "No response."}</p>
	                  ${safeInsights && safeInsights[i] ? 
	                    `<div style="background-color: #f5f5f5; padding: 10px; border-left: 4px solid #4a90e2; margin-top: 10px;">
	                      <h4 style="color: #4a90e2; margin-top: 0;">🧠 AI Caddie's Insight</h4>
	                      <p>${safeInsights[i]}</p>
	                    </div>` : 
	                    ''}
	                </div>
	                <hr/>
	              `
				)
				.join("")}
	        ${safeSummary ? `
	          <div style="page-break-before: always;">
	            <h2>⭐ Your Final Yardage Book Summary</h2>
	            <p>${safeSummary}</p>
	          </div>` : ""}
	      </div>
	    `;
		const element = document.createElement("div");
		element.innerHTML = content;
		html2pdf()
			.set({
				margin: 0.5,
				filename: "enhanced-ryder-cup-yardage-book.pdf",
				html2canvas: { scale: 2 },
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