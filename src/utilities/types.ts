import type { Component } from 'vue';

export interface ProjectItem {
  id: number;
  title: string;
  lines: string[];
  buttons: string[];
}

export interface NavItem {
  id: number;
  label: string;
  icon: Component;
  to: string;
}

export interface Event {
  id: number;
  userId: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface Column {
  key: string;
  label: string;
  headerClass?: string;
  cellClass?: string;
  width?: string | number;
  noWrap?: boolean;
  align?: 'start' | 'center' | 'end';
}

export interface ToasterItem {
  id: number;
  message: string;
  type?: ToastType;
}
export type ToastType = 'success' | 'error' | 'info' | 'warning';
export type Theme = 'light' | 'dark' | 'blue' | 'system';
export type ThemeOption = { value: Theme; label: string };




// Define the structure for the overlay's position and size
export interface OverlayStyle {
    left: string;
    top: string;
    width: string;
    height: string;
}

// Define the structure for the HTML/CSS/JS overlay content
export interface HtmlContent {
    // Retain individual fields for use by the renderer
    html: string;
    css: string;
    js: string;
    // NEW: Field to hold the single textarea input
    combinedCode: string;
}

export type OverlayType = 'image' | 'video' | 'html';

// Define the main overlay object
export interface Overlay {
    type: OverlayType | null;
    content: string | null; // Base64 URL or placeholder string
    style: OverlayStyle;
    htmlContent: HtmlContent;
}

// Define the dimensions of the preview container
export interface ContainerDimensions {
    width: number;
    height: number;
}

export const DEFAULT_HTML_CONTENT: HtmlContent = {
    html: '<h1>Hello World!</h1>',
    css: 'h1 { color: #3498db; font-family: sans-serif; }',
    js: '',
    combinedCode: '<h1>My HTML Content</h1>\n\n<style>\nh1 { color: #3498db; }\n</style>\n\n<script>\n// console.log("Overlay Ready");\n</script>'
};
