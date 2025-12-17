import { publicInstance } from "@/axios/axiosInstance";
import { useQuery, useMutation } from "@tanstack/react-query";

// ACCUEILS
export const useGetAccueils = () => {
  return useQuery({
    queryKey: ["accueils"],
    queryFn: async () => {
      const res = await publicInstance.get("/accueils");
      return res.data.data;
    },
  });
};

export const useGetAccueilById = (id: string | number) => {
  return useQuery({
    queryKey: ["accueils", id],
    queryFn: async () => {
      const res = await publicInstance.get(`/accueils/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
};

// ACTUALITES
export const useGetActualites = () => {
  return useQuery({
    queryKey: ["actualites"],
    queryFn: async () => {
      const res = await publicInstance.get("/actualites");
      return res.data.data;
    },
  });
};

export const useGetActualiteById = (id: string | number) => {
  return useQuery({
    queryKey: ["actualites", id],
    queryFn: async () => {
      const res = await publicInstance.get(`/actualites/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
};

// EVENEMENTS
export const useGetEvenements = () => {
  return useQuery({
    queryKey: ["evenements"],
    queryFn: async () => {
      const res = await publicInstance.get("/evenements");
      return res.data.data;
    },
  });
};

export const useGetEvenementById = (id: string | number) => {
  return useQuery({
    queryKey: ["evenements", id],
    queryFn: async () => {
      const res = await publicInstance.get(`/evenements/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
};

// GALERIES
export const useGetGaleries = () => {
  return useQuery({
    queryKey: ["galeries"],
    queryFn: async () => {
      const res = await publicInstance.get("/galeries");
      return res.data.data;
    },
  });
};

export const useGetGalerieById = (id: string | number) => {
  return useQuery({
    queryKey: ["galeries", id],
    queryFn: async () => {
      const res = await publicInstance.get(`/galeries/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
};

// PRESENTATIONS
export const useGetPresentations = () => {
  return useQuery({
    queryKey: ["presentations"],
    queryFn: async () => {
      const res = await publicInstance.get("/presentations");
      return res.data.data;
    },
  });
};

export const useGetPresentationById = (id: string | number) => {
  return useQuery({
    queryKey: ["presentations", id],
    queryFn: async () => {
      const res = await publicInstance.get(`/presentations/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
};

// CONTACTS
export const useGetContacts = () => {
  return useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const res = await publicInstance.get("/contacts");
      return res.data.data;
    },
  });
};

export const useGetContactById = (id: string | number) => {
  return useQuery({
    queryKey: ["contacts", id],
    queryFn: async () => {
      const res = await publicInstance.get(`/contacts/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
};

export const useCreateContact = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await publicInstance.post("/contacts", data);
      return res.data;
    },
  });
};