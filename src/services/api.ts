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

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("token");
    throw new Error("Session expired. Please login again.");
  }

  let result: any;
  try {
    const text = await response.text();
    result = text ? JSON.parse(text) : text;
  } catch {
    result = null;
  }

  if (!response.ok) {
    throw new Error(result?.message || result || `Error ${response.status}`);
  }

  return result;
}

/* =========================================================
   🧩 PRODUCT CATEGORY APIs
========================================================= */

export const getAllProductCategories = () =>
  adminApi("/admin/get-all-categories");

export const saveProductCategory = (name: string) =>
  adminApi(`/admin/save-ProductCategory?name=${encodeURIComponent(name)}`, "POST");

export const updateProductCategory = (id: number, name: string) =>
  adminApi(
    `/admin/edit-productCategory?id=${id}&name=${encodeURIComponent(name)}`,
    "PUT"
  );

export const deleteProductCategory = (id: number) =>
  adminApi(`/admin/delete-productCategory?id=${id}`, "DELETE");

/* =========================================================
   🛍️ SHOP BY CATEGORY APIs
========================================================= */

export const getAllShopByCategory = () =>
  adminApi("/admin/get-all-shop-by-categories");

export const saveShopByCategory = (file: File, name: string) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("name", name);
  return adminApi("/admin/save-shopByCategory", "POST", formData, true);
};

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

export const deleteShopByCategory = (id: number) =>
  adminApi(`/admin/delete-shopByCategory?id=${id}`, "DELETE");

/* =========================================================
   🏪 SHOP BY NAME APIs
========================================================= */

export const getAllShopByNames = () =>
  adminApi("/admin/get-all-shop-by-name");

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

/* =========================================================
   📰 BLOG APIs
========================================================= */

export const getAllBlogs = () =>
  adminApi("/admin/get-all-blogs");

export const saveBlog = (file: File, title: string, description: string) => {
  const formData = new FormData();
  console.log(title);
  console.log(description)
  formData.append("file", file);
  formData.append("title", title);
  formData.append("description", description);

  const blogData = { title, description };
  formData.append(
    "blog",
    new Blob([JSON.stringify(blogData)], { type: "application/json" })
  );
  return adminApi("/admin/save-blog", "POST", formData, true);
};

export const updateBlog = (id: number, title: string, description: string, file?: File) => {
  const formData = new FormData();
  if (file) formData.append("file", file);
  const updates = { title, description };
  formData.append(
    "updates",
    new Blob([JSON.stringify(updates)], { type: "application/json" })
  );
  return adminApi(`/admin/edit-blog?id=${id}`, "PUT", formData, true);
};

export const deleteBlog = (id: number) =>
  adminApi(`/admin/delete-blog?id=${id}`, "DELETE");

/* =========================================================
   📦 ORDERS & PAYMENTS APIs
========================================================= */

// ➤ Get all assigned orders
export const getAllOrders = () => adminApi("/admin/get-all-orders");

// ➤ Get payment details for a seller
export const getSellerPaymentData = (sellerId: string) =>
  adminApi(`/admin/get-payment-data?sellerId=${sellerId}`);

// ➤ Send OTP to seller email for payment
export const sendPaymentOtp = (sellerId: string, amount: number) =>
  adminApi(`/admin/send-email-otp-for-payment?id=${sellerId}&amount=${amount}`, "POST");

// ➤ Verify OTP before paying seller
export const verifyPaymentOtp = (email: string, otp: string) =>
  adminApi(`/admin/verify-email-otp-for-payment?email=${email}&otp=${otp}`, "POST");

// ➤ Pay to seller
export const payToSeller = (sellerId: string, amount: number) =>
  adminApi(`/admin/pay-to-seller?id=${sellerId}&amount=${amount}`, "POST");

// ➤ Receive payment from seller
export const receiveFromSeller = (sellerId: string, amount: number) =>
  adminApi(`/admin/get-from-seller?id=${sellerId}&amount=${amount}`, "POST");
// ➤ Get all sellers
export const getAllSellers = () => adminApi("/admin/get-all-seller");
