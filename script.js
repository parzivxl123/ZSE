// --- Supabase connection ---
const SUPABASE_URL = "https://YOUR-PROJECT-REF.supabase.co";
const SUPABASE_KEY = "YOUR-ANON-PUBLIC-KEY";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- Auth logic ---
const signupBtn = document.getElementById("signup-btn");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const portfolioSection = document.getElementById("portfolio-section");
const authSection = document.getElementById("auth-section");

signupBtn.onclick = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) alert(error.message);
  else alert("Signup successful! Check your email for confirmation.");
};

loginBtn.onclick = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) alert(error.message);
  else {
    alert("Logged in!");
    authSection.style.display = "none";
    portfolioSection.style.display = "block";
  }
};

logoutBtn.onclick = async () => {
  await supabase.auth.signOut();
  authSection.style.display = "block";
  portfolioSection.style.display = "none";
};

// --- Portfolio logic ---
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("portfolio-list");

addBtn.onclick = async () => {
  const stock = document.getElementById("stock-name").value;
  const shares = parseInt(document.getElementById("shares").value);
  const price = parseFloat(document.getElementById("price").value);

  const user = (await supabase.auth.getUser()).data.user;
  if (!user) {
    alert("Please log in first.");
    return;
  }

  const { error } = await supabase
    .from("portfolio")
    .insert([{ user_id: user.id, stock_name: stock, shares, price }]);

  if (error) alert(error.message);
  else {
    alert("Stock added!");
    loadPortfolio();
  }
};

async function loadPortfolio() {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return;

  const { data, error } = await supabase
    .from("portfolio")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    console.error(error);
    return;
  }

  list.innerHTML = "";
  data.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.stock_name} — ${item.shares} shares @ ₹${item.price}`;
    list.appendChild(li);
  });
}
