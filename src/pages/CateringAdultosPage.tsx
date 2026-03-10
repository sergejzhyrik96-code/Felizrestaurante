import { useRef } from "react";
import CateringDetailLayout from "@/components/CateringDetailLayout";

const CateringAdultosPage = () => {
  const formRef = useRef<HTMLDivElement | null>(null);

  return (
    <CateringDetailLayout
      formRef={formRef}
      titleKey="catering.cardAdults"
      heroDescKey="catering.adultsHeroDesc"
      heroSubKey="catering.adultsHeroSub"
      features={[
        { key: "catering.adultsFeature1", subKey: "catering.adultsFeature1Sub" },
        { key: "catering.adultsFeature2", subKey: "catering.adultsFeature2Sub" },
        { key: "catering.adultsFeature3", subKey: "catering.adultsFeature3Sub" },
      ]}
      packages={[
        { nameKey: "catering.adultsPackageCelebracion", priceKey: "catering.adultsCelebracionPrice", itemsKey: "catering.adultsCelebracionItems" },
        { nameKey: "catering.adultsPackageSignature", priceKey: "catering.adultsSignaturePrice", itemsKey: "catering.adultsSignatureItems" },
        { nameKey: "catering.adultsPackageLuxury", priceKey: "catering.adultsLuxuryPrice", itemsKey: "catering.adultsLuxuryItems" },
      ]}
      steps={[
        { key: "catering.adultsStep1", descKey: "catering.adultsStep1Desc" },
        { key: "catering.adultsStep2", descKey: "catering.adultsStep2Desc" },
        { key: "catering.adultsStep3", descKey: "catering.adultsStep3Desc" },
        { key: "catering.adultsStep4", descKey: "catering.adultsStep4Desc" },
      ]}
      cases={[
        { key: "catering.adultsCase1", subKey: "catering.adultsCase1Sub" },
        { key: "catering.adultsCase2", subKey: "catering.adultsCase2Sub" },
      ]}
      accordionItems={[
        { titleKey: "catering.adultsAccordion1", listKey: "catering.adultsAccordion1List" },
        { titleKey: "catering.adultsAccordion2", listKey: "catering.adultsAccordion2List" },
        { titleKey: "catering.adultsAccordion3", listKey: "catering.adultsAccordion3List" },
        { titleKey: "catering.adultsAccordion4", listKey: "catering.adultsAccordion4List" },
        { titleKey: "catering.adultsAccordion5", listKey: "catering.adultsAccordion5List" },
        { titleKey: "catering.adultsAccordion6", listKey: "catering.adultsAccordion6List" },
      ]}
      faqItems={[
        { qKey: "catering.adultsFaq1", aKey: "catering.adultsFaq1A" },
        { qKey: "catering.adultsFaq2", aKey: "catering.adultsFaq2A" },
        { qKey: "catering.adultsFaq3", aKey: "catering.adultsFaq3A" },
      ]}
    />
  );
};

export default CateringAdultosPage;
