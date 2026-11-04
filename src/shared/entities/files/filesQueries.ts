import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";

import { api } from "@/shared/api";
import type { FileCategory } from "@/shared/entities/files/filesTypes";

// POST /v1/files/presigned-url 응답(서버 FileUploadUrlIssueResponse)
export const fileUploadUrlResponseSchema = z.looseObject({
  fileId: z.number(),
  // 스토리지에 파일 본문을 바로 PUT하는 서명된 주소
  uploadUrl: z.string(),
  // 다른 API(학생회비 납부 요청 등)에 넘기는 파일 키
  fileKey: z.string(),
  expiresAt: z.string(),
});

interface UploadFileVariables {
  file: File;
  category: FileCategory;
}

// 파일을 스토리지에 올리고, 다른 API에 넘길 파일 키를 돌려준다.
// 서버에서 업로드 URL을 받은 뒤(POST /v1/files/presigned-url) 그 주소로 파일 본문을 바로 PUT한다.
// PUT은 apiClient를 거치지 않는다 — 스토리지 주소라 baseURL·인증 헤더가 붙으면 안 되고, 응답도 서버 봉투가 아니다.
export function useUploadFileMutation() {
  return useMutation({
    mutationFn: async ({ file, category }: UploadFileVariables) => {
      const { fileKey, uploadUrl } = fileUploadUrlResponseSchema.parse(
        await api.post<unknown>("/v1/files/presigned-url", {
          category,
          contentType: file.type,
          fileSize: file.size,
          originalName: file.name,
        }),
      );
      // 서명에 Content-Type이 들어가 있어서 발급 때 보낸 값과 같아야 한다
      await axios.put(uploadUrl, file, {
        headers: { "Content-Type": file.type },
      });
      return fileKey;
    },
  });
}
