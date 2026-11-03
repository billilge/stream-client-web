import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import type { FileCategory, FileUploadUrl } from "@/entities/files/types";
import { api } from "@/lib/api/client";

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
      const { fileKey, uploadUrl } = await api.post<FileUploadUrl>(
        "/v1/files/presigned-url",
        {
          category,
          contentType: file.type,
          fileSize: file.size,
          originalName: file.name,
        },
      );
      // 서명에 Content-Type이 들어가 있어서 발급 때 보낸 값과 같아야 한다
      await axios.put(uploadUrl, file, {
        headers: { "Content-Type": file.type },
      });
      return fileKey;
    },
  });
}
