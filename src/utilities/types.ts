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
  title: string;
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
