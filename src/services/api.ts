export const api_base_url = "https://api.shreeaura.in";

/* 🔐 Admin Login URL */
export const adminLoginUrl = `${api_base_url}/auth/admin-login`;

/* ------------------------------
   🔑 ADMIN LOGIN FUNCTION
------------------------------ */
export async function adminLogin(email: string, password: string) {
  const response = await fetch(`${adminLoginUrl}?email=${email}&password=${password}`, {
    method: "POST",
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Login failed: ${error}`);
  }

  const token = await response.text();
  localStorage.setItem("token", token);
  return token;
}

/* ------------------------------
   ⚙️ UNIVERSAL ADMIN API CALLER
------------------------------ */
export async function adminApi(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any,
  isFormData: boolean = false
) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Admin not authenticated. Please login again.");

  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
  };

  if (!isFormData) headers["Content-Type"] = "application/json";

  const response = await fetch(`https://api.shreeaura.in${endpoint}`, {
    method,
    headers,
    body: body
      ? isFormData
        ? body
        : JSON.stringify(body)
      : undefined,
  });

  // ✅ Handle authentication failure
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("token");
    throw new Error("Session expired. Please login again.");
  }

  // ✅ Try parsing JSON safely
  let result: any;
  try {
    const text = await response.text();
    result = text ? JSON.parse(text) : text;
  } catch {
    result = null;
  }

  // ✅ Handle non-OK
  if (!response.ok) {
    throw new Error(result?.message || result || `Error ${response.status}`);
  }

  return result;
}

/* =========================================================
   🧩 PRODUCT CATEGORY APIs
========================================================= */

// ➤ Get all Product Categories
export const getAllProductCategories = () =>
  adminApi("/admin/get-all-categories");

// ➤ Save new Product Category
export const saveProductCategory = (name: string) => {
  console.log(name);
  return adminApi(`/admin/save-ProductCategory?name=${encodeURIComponent(name)}`, "POST");
};

// ➤ Update Product Category
export const updateProductCategory = (id: number, name: string) =>
  adminApi(
    `/admin/edit-productCategory?id=${id}&name=${encodeURIComponent(name)}`,
    "PUT"
  );

// ➤ Delete Product Category
export const deleteProductCategory = (id: number) =>
  adminApi(`/admin/delete-productCategory?id=${id}`, "DELETE");

/* =========================================================
   🛍️ SHOP BY CATEGORY APIs
========================================================= */

// ➤ Get all ShopByCategory
export const getAllShopByCategory = () =>
  adminApi("/admin/get-all-shop-by-categories");

// ➤ Save ShopByCategory (with image)
export const saveShopByCategory = (file: File, name: string) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("name", name);
  return adminApi("/admin/save-shopByCategory", "POST", formData, true);
};

// ➤ Update ShopByCategory
export const updateShopByCategory = (
  id: number,
  name: string,
  file?: File
) => {
  const formData = new FormData();
  if (file) formData.append("file", file);
  const updates = { name };
  formData.append(
    "updates",
    new Blob([JSON.stringify(updates)], { type: "application/json" })
  );
  return adminApi(`/admin/edit-shopByCategory?id=${id}`, "PUT", formData, true);
};

// ➤ Delete ShopByCategory
export const deleteShopByCategory = (id: number) =>
  adminApi(`/admin/delete-shopByCategory?id=${id}`, "DELETE");

/* =========================================================
   🏪 SHOP BY NAME APIs
========================================================= */

// ➤ Get all ShopByName
export const getAllShopByNames = () =>
  adminApi("/admin/get-all-shop-by-name", "GET");

export const saveShopByName = (file: File, name: string) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("name", name);
  return adminApi("/admin/save-shopByName", "POST", formData, true);
};

export const updateShopByName = (id: number, file: File | null, name: string) => {
  const formData = new FormData();
if (file) formData.append("file", file);
const updates = { name };
formData.append(
  "updates",
  new Blob([JSON.stringify(updates)], { type: "application/json" })
);
return adminApi(`/admin/edit-shopByName?id=${id}`, "PUT", formData, true);

};

export const deleteShopByName = (id: number) =>
  adminApi(`/admin/delete-shopByName?id=${id}`, "DELETE");
