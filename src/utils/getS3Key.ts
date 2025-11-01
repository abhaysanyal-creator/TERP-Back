import { UploadModule, UploadCategory } from "../types/reference.types";

interface S3KeyParams {
  org_id: string;
  module: UploadModule;
  entityId?: string;
  category?: UploadCategory<UploadModule>;
  fileName: string;
}

export const getS3Key = ({
  org_id,
  module,
  entityId,
  category,
  fileName,
}: S3KeyParams) => {
  let prefix = `orgs/${org_id}/${module}`;

  if (entityId) prefix += `/${entityId}`;
  if (category) prefix += `/${category}`;

  return `${prefix}/${fileName}`;
};
