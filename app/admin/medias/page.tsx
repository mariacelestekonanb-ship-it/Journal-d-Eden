import { mediaAssets } from "@/lib/admin/media";
import { MediaGallery } from "@/app/admin/medias/media-gallery";

export const metadata = { title: "Médiathèque" };

export default function MediasPage() {
  return <MediaGallery items={mediaAssets} />;
}
