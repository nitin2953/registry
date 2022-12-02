const qrcode = require("qrcode-terminal");
const devIp = require("dev-ip");

module.exports = function (eleventyConfig) {
	eleventyConfig.setQuietMode(true);
	eleventyConfig.addWatchTarget("src");

	eleventyConfig.addPassthroughCopy("src/site/main.js");

	eleventyConfig.setServerOptions({ showAllHosts: true });
	let devip = "http://" + devIp()[0] + ":8080";
	if (devIp()[0]) {
		console.log(devip);
		qrcode.generate(devip, { small: true });
	}

	return {
		templateFormats: ["njk", "md", "html"],
		markdownTemplateEngine: "njk",
		passthroughFileCopy: true,
		dir: {
			includes: "./../_includes",
			data: "./../_data",
			input: "src/site",
			output: "dist",
		},
	};
};
