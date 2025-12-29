import type { StructuredDataType } from '@/lib/metadata';
import { sanitizeJsonLd } from '@/lib/metadata';

interface JsonLdProps {
  data: StructuredDataType | StructuredDataType[];
}

export function JsonLd({ data }: JsonLdProps) {
  const jsonLdArray = Array.isArray(data) ? data : [data];

  return (
    <>
      {jsonLdArray.map((item, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: sanitizeJsonLd(item) }} />
      ))}
    </>
  );
}
