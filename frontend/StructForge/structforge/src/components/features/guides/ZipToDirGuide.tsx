import { GuideModal, type GuideStep } from '@/components/ui/GuideModal';

import guideZip1 from '@/assets/guideZip1.png';
import guideZip2 from '@/assets/guideZip2.png';
import guideZip3 from '@/assets/guideZip3.png';

const steps: GuideStep[] = [
  {
    title: "Upload Your Zip File",
    description: "Simply drag & drop your project zip file into the upload zone. We process everything locally in your browser for security.",
    image: guideZip1
  },
  {
    title: "Interactive Visualization",
    description: "The map starts collapsed to keep things clean. Click on any folder node to expand it and reveal its contents.",
    image: guideZip2
  },
  {
    title: "Export & Use",
    description: "Once you are happy with the view, use the export button to copy the ASCII structure directly to your clipboard.",
    image: guideZip3
  }
];

export const ZipToDirGuide = () => {
  return <GuideModal title="Zip to Directory" steps={steps} />;
};