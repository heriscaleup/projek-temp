import { Organization, WebSite, WithContext, Article, BreadcrumbList } from 'schema-dts';

export const JsonLd = ({ data }: { data: WithContext<Organization | WebSite | Article | BreadcrumbList> }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};
