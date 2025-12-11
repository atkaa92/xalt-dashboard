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
  additionalAttributes?: Record<string, string>;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  subdomain?: string;
  subdomainId?: number;
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

export interface OverlayStyle {
  left: string;
  top: string;
  width: string;
  height: string;
}

export interface HtmlContent {
  html: string;
  css: string;
  js: string;
  combinedCode: string;
}

export interface Overlay {
  type: OverlayType | null;
  content: string | null;
  style: OverlayStyle;
  htmlContent: HtmlContent;
}

export interface ContainerDimensions {
  width: number;
  height: number;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';
export type Theme = 'light' | 'dark' | 'blue' | 'system';
export type ThemeOption = { value: Theme; label: string };
export type OverlayType = 'image' | 'video' | 'html';

export const DEFAULT_HTML_CONTENT: HtmlContent = {
  html: '<h1>Hello World!</h1>',
  css: 'h1 { color: #3498db; font-family: sans-serif; }',
  js: '',
  combinedCode:
    '<h1>My HTML Content</h1>\n\n<style>\nh1 { color: #3498db; }\n</style>\n\n<script>\n// console.log("Overlay Ready");\n</script>',
};
