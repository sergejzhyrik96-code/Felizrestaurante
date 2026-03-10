import { useRef } from "react";
import CateringDetailLayout from "@/components/CateringDetailLayout";

const CateringInfantilesPage = () => {
  const formRef = useRef<HTMLDivElement | null>(null);

  return (
    <CateringDetailLayout
      formRef={formRef}
      titleKey="catering.cardKids"
      heroDescKey="catering.kidsHeroDesc"
      heroSubKey="catering.kidsHeroSub"
      features={[
        { key: "catering.kidsFeature1", subKey: "catering.kidsFeature1Sub" },
        { key: "catering.kidsFeature2", subKey: "catering.kidsFeature2Sub" },
        { key: "catering.kidsFeature3", subKey: "catering.kidsFeature3Sub" },
      ]}
      packages={[
        { nameKey: "catering.kidsPackageMini", priceKey: "catering.kidsMiniPrice", itemsKey: "catering.kidsMiniItems" },
        { nameKey: "catering.kidsPackagePlus", priceKey: "catering.kidsPlusPrice", itemsKey: "catering.kidsPlusItems" },
        { nameKey: "catering.kidsPackagePremium", priceKey: "catering.kidsPremiumPrice", itemsKey: "catering.kidsPremiumItems" },
      ]}
      steps={[
        { key: "catering.kidsStep1", descKey: "catering.kidsStep1Desc" },
        { key: "catering.kidsStep2", descKey: "catering.kidsStep2Desc" },
        { key: "catering.kidsStep3", descKey: "catering.kidsStep3Desc" },
        { key: "catering.kidsStep4", descKey: "catering.kidsStep4Desc" },
      ]}
      cases={[
        { key: "catering.kidsCase1", subKey: "catering.kidsCase1Sub" },
        { key: "catering.kidsCase2", subKey: "catering.kidsCase2Sub" },
      ]}
      accordionItems={[
        { titleKey: "catering.kidsAccordion1", listKey: "catering.kidsAccordion1List" },
        { titleKey: "catering.kidsAccordion2", listKey: "catering.kidsAccordion2List" },
        { titleKey: "catering.kidsAccordion3", listKey: "catering.kidsAccordion3List" },
        { titleKey: "catering.kidsAccordion4", listKey: "catering.kidsAccordion4List" },
      ]}
      faqItems={[
        { qKey: "catering.kidsFaq1", aKey: "catering.kidsFaq1A" },
        { qKey: "catering.kidsFaq2", aKey: "catering.kidsFaq2A" },
        { qKey: "catering.kidsFaq3", aKey: "catering.kidsFaq3A" },
      ]}
    />
  );
};

export default CateringInfantilesPage;
