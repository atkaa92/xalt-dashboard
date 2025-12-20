import type { ContainerDimensions, HtmlContent, OverlayStyle, OverlayType } from './ui';

export interface AssetAttributes {
  type: OverlayType;
  content: string | null;
  style: OverlayStyle;
  htmlContent?: HtmlContent;
  containerDimensions: ContainerDimensions;
}

export interface Asset {
  id: number;
  subdomainId: number;
  name: string;
  attributes: AssetAttributes;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAssetRequest {
  subdomainId: number;
  name: string;
  attributes: AssetAttributes;
}
