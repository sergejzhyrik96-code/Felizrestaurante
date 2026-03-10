import { useRef } from "react";
import CateringDetailLayout from "@/components/CateringDetailLayout";

const CateringGastronomicosPage = () => {
  const formRef = useRef<HTMLDivElement | null>(null);

  return (
    <CateringDetailLayout
      formRef={formRef}
      titleKey="catering.cardGastro"
      heroDescKey="catering.gastroHeroDesc"
      heroSubKey="catering.gastroHeroSub"
      features={[
        { key: "catering.gastroFeature1", subKey: "catering.gastroFeature1Sub" },
        { key: "catering.gastroFeature2", subKey: "catering.gastroFeature2Sub" },
        { key: "catering.gastroFeature3", subKey: "catering.gastroFeature3Sub" },
      ]}
      packages={[
        { nameKey: "catering.gastroPackageBase", priceKey: "catering.gastroBasePrice", itemsKey: "catering.gastroBaseItems" },
        { nameKey: "catering.gastroPackageSignature", priceKey: "catering.gastroSignaturePrice", itemsKey: "catering.gastroSignatureItems" },
        { nameKey: "catering.gastroPackagePremium", priceKey: "catering.gastroPremiumPrice", itemsKey: "catering.gastroPremiumItems" },
      ]}
      steps={[
        { key: "catering.gastroStep1", descKey: "catering.gastroStep1Desc" },
        { key: "catering.gastroStep2", descKey: "catering.gastroStep2Desc" },
        { key: "catering.gastroStep3", descKey: "catering.gastroStep3Desc" },
        { key: "catering.gastroStep4", descKey: "catering.gastroStep4Desc" },
      ]}
      cases={[
        { key: "catering.gastroCase1", subKey: "catering.gastroCase1Sub" },
        { key: "catering.gastroCase2", subKey: "catering.gastroCase2Sub" },
      ]}
      accordionItems={[
        { titleKey: "catering.gastroAccordion1", descKey: "catering.gastroAccordion1Desc", listKey: "catering.gastroAccordion1List" },
        { titleKey: "catering.gastroAccordion2", descKey: "catering.gastroAccordion2Desc", listKey: "catering.gastroAccordion2List" },
        { titleKey: "catering.gastroAccordion3", descKey: "catering.gastroAccordion3Desc", listKey: "catering.gastroAccordion3List" },
        { titleKey: "catering.gastroAccordion4", descKey: "catering.gastroAccordion4Desc", listKey: "catering.gastroAccordion4List" },
        { titleKey: "catering.gastroAccordion5", descKey: "catering.gastroAccordion5Desc", listKey: "catering.gastroAccordion5List" },
        { titleKey: "catering.gastroAccordion6", descKey: "catering.gastroAccordion6Desc", listKey: "catering.gastroAccordion6List" },
      ]}
      faqItems={[
        { qKey: "catering.gastroFaq1", aKey: "catering.gastroFaq1A" },
        { qKey: "catering.gastroFaq2", aKey: "catering.gastroFaq2A" },
        { qKey: "catering.gastroFaq3", aKey: "catering.gastroFaq3A" },
      ]}
    />
  );
};

export default CateringGastronomicosPage;
