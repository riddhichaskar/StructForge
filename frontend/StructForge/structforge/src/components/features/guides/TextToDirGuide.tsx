import { GuideModal, type GuideStep } from '@/components/ui/GuideModal';

// FIX 1: Use valid variable names (camelCase)
// FIX 2: Point to the correct path (assets/file.png, not assets/images/file.png)
import guideText1 from '@/assets/guideText1.png';
import guideText2 from '@/assets/guideText2.png';
import guideText3 from '@/assets/guideText3.png';

const steps: GuideStep[] = [
  {
    title: "Paste Directory Text",
    description: "Paste any text that looks like a file tree. We support standard characters (├──) and simple indentation.",
    image: guideText1 // Use the imported variable
  },
  {
    title: "Instant Preview",
    description: "As you type or paste, the visual graph on the right updates instantly. Use the toggle to switch between vertical and horizontal layouts.",
    image: guideText2
  },
  {
    title: "Download as Zip",
    description: "Need the actual files? Click the 'Generate' button to convert your text structure into a real downloadable zip file.",
    image: guideText3
  }
];

export const TextToDirGuide = () => {
  return <GuideModal title="Text to Directory" steps={steps} />;
};