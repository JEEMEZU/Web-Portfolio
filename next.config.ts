import path from 'path';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	turbopack: {
		// Ensure Turbopack resolves the correct project root when multiple lockfiles exist
		root: path.resolve(__dirname),
	},
};

export default nextConfig;
