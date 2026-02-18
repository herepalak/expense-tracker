import { useState, useEffect } from "react";

const CATEGORIES = [
  { name: "Food", icon: "🍜", color: "#ff6b6b" },
  { name: "Transport", icon: "🚗", color: "#ffd93d" },
  { name: "Shopping", icon: "🛍️", color: "#6bcb77" },
  { name: "Bills", icon: "⚡", color: "#4d96ff" },
  { name: "Health", icon: "💊", color: "#ff922b" },
  { name: "Fun", icon: "🎮", color: "#cc5de8" },
  { name: "Other", icon: "📦", color: "#868e96" },
];

const INITIAL_EXPENSES = [
  { id: 1, title: "Grocery Store", amount: 54.2, category: "Food", date: "2026-02-15" },
  { id: 2, title: "Uber Ride", amount: 12.5, category: "Transport", date: "2026-02-16" },
  { id: 3, title: "Netflix", amount: 15.99, category: "Bills", date: "2026-02-17" },
  { id: 4, title: "New Shoes", amount: 89.0, category: "Shopping", date: "2026-02-17" },
  { id: 5, title: "Gym Membership", amount: 30.0, category: "Health", date: "2026-02-18" },
];

const getCat = (name) => CATEGORIES.find((c) => c.name === name) || CATEGORIES[6];

const formatINR = (n) =>
  "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [form, setForm] = useState({ title: "", amount: "", category: "Food", date: new Date().toISOString().slice(0, 10) });
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [budget, setBudget] = useState(500);
  const [editBudget, setEditBudget] = useState(false);

  useEffect(() => { setAnimate(true); }, []);

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const remaining = budget - total;
  const pct = Math.min((total / budget) * 100, 100);

  const catTotals = CATEGORIES.map((c) => ({
    ...c,
    total: expenses.filter((e) => e.category === c.name).reduce((s, e) => s + e.amount, 0),
  })).filter((c) => c.total > 0).sort((a, b) => b.total - a.total);

  const filtered = filter === "All" ? expenses : expenses.filter((e) => e.category === filter);

  const addExpense = () => {
    if (!form.title || !form.amount) return;
    const newExp = { ...form, id: Date.now(), amount: parseFloat(form.amount) };
    setExpenses([newExp, ...expenses]);
    setForm({ title: "", amount: "", category: "Food", date: new Date().toISOString().slice(0, 10) });
    setShowForm(false);
  };

  const deleteExpense = (id) => setExpenses(expenses.filter((e) => e.id !== id));

  const barColor = pct > 85 ? "#ff6b6b" : pct > 60 ? "#ffd93d" : "#6bcb77";

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      fontFamily: "'Georgia', serif",
      color: "#f0ece3",
      padding: "0",
    }}>

      {/* Top Hero */}
      <div style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        padding: "32px 24px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* decorative circles */}
        <div style={{ position:"absolute", top:-60, right:-60, width:200, height:200, borderRadius:"50%", background:"rgba(77,150,255,0.07)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:-40, left:-40, width:150, height:150, borderRadius:"50%", background:"rgba(107,203,119,0.07)", pointerEvents:"none" }}/>

        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <div style={{ fontSize:11, letterSpacing:3, color:"#4d96ff", textTransform:"uppercase", marginBottom:6 }}>February 2026</div>
              <h1 style={{ fontSize:28, fontWeight:400, margin:0, lineHeight:1.2 }}>Expense<br/><span style={{ fontStyle:"italic", color:"#4d96ff" }}>Tracker</span></h1>
            </div>
            <button onClick={() => setShowForm(!showForm)} style={{
              background: showForm ? "rgba(255,107,107,0.2)" : "rgba(77,150,255,0.2)",
              border: `1px solid ${showForm ? "#ff6b6b" : "#4d96ff"}`,
              color: showForm ? "#ff6b6b" : "#4d96ff",
              borderRadius: 50,
              width: 44, height: 44,
              fontSize: 22,
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
              flexShrink: 0,
            }}>
              {showForm ? "×" : "+"}
            </button>
          </div>

          {/* Budget Bar */}
          <div style={{ marginTop: 24 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8, alignItems:"center" }}>
              <span style={{ fontSize:12, color:"#888", letterSpacing:1 }}>BUDGET</span>
              {editBudget ? (
                <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                  <input type="number" value={budget} onChange={e=>setBudget(+e.target.value)}
                    style={{ width:80, background:"#1a1a2e", border:"1px solid #4d96ff", color:"#f0ece3", borderRadius:6, padding:"2px 6px", fontSize:13 }}/>
                  <button onClick={()=>setEditBudget(false)} style={{ background:"#4d96ff", border:"none", color:"#fff", borderRadius:6, padding:"2px 8px", cursor:"pointer", fontSize:12 }}>✓</button>
                </div>
              ) : (
                <span style={{ fontSize:13, color:"#ccc", cursor:"pointer" }} onClick={()=>setEditBudget(true)}>
                  {formatINR(budget)} <span style={{ fontSize:10, color:"#555" }}>✎</span>
                </span>
              )}
            </div>
            <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:99, height:8, overflow:"hidden" }}>
              <div style={{
                height:"100%", width:`${pct}%`, borderRadius:99,
                background: `linear-gradient(90deg, ${barColor}99, ${barColor})`,
                transition:"width 0.8s cubic-bezier(0.4,0,0.2,1)",
              }}/>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:8 }}>
              <span style={{ fontSize:22, fontWeight:700, color: barColor }}>{formatINR(total)}</span>
              <span style={{ fontSize:13, color: remaining < 0 ? "#ff6b6b" : "#6bcb77", alignSelf:"flex-end" }}>
                {remaining < 0 ? "Over by " + formatINR(Math.abs(remaining)) : formatINR(remaining) + " left"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 16px 40px" }}>

        {/* Add Form */}
        {showForm && (
          <div style={{
            background:"#13131f", border:"1px solid rgba(77,150,255,0.3)",
            borderRadius:16, padding:20, marginTop:16,
            animation: "slideDown 0.25s ease",
          }}>
            <style>{`@keyframes slideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }`}</style>
            <div style={{ fontSize:12, letterSpacing:2, color:"#4d96ff", marginBottom:14, textTransform:"uppercase" }}>New Expense</div>

            <input placeholder="What did you spend on?" value={form.title}
              onChange={e=>setForm({...form,title:e.target.value})}
              style={inputStyle} />

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, margin:"10px 0" }}>
              <input placeholder="Amount (₹)" type="number" value={form.amount}
                onChange={e=>setForm({...form,amount:e.target.value})}
                style={inputStyle} />
              <input type="date" value={form.date}
                onChange={e=>setForm({...form,date:e.target.value})}
                style={inputStyle} />
            </div>

            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:14 }}>
              {CATEGORIES.map(c => (
                <button key={c.name} onClick={()=>setForm({...form,category:c.name})} style={{
                  background: form.category===c.name ? c.color+"33" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${form.category===c.name ? c.color : "rgba(255,255,255,0.1)"}`,
                  color: form.category===c.name ? c.color : "#888",
                  borderRadius:99, padding:"5px 12px", fontSize:12, cursor:"pointer",
                  transition:"all 0.15s",
                }}>
                  {c.icon} {c.name}
                </button>
              ))}
            </div>

            <button onClick={addExpense} style={{
              width:"100%", padding:12, background:"linear-gradient(135deg,#4d96ff,#6bcb77)",
              border:"none", borderRadius:10, color:"#fff", fontFamily:"Georgia,serif",
              fontSize:14, fontWeight:600, cursor:"pointer", letterSpacing:1,
            }}>
              Add Expense
            </button>
          </div>
        )}

        {/* Category Breakdown */}
        {catTotals.length > 0 && (
          <div style={{ marginTop:20 }}>
            <div style={{ fontSize:11, letterSpacing:3, color:"#555", textTransform:"uppercase", marginBottom:12 }}>Breakdown</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {catTotals.map(c => {
                const w = total > 0 ? (c.total/total)*100 : 0;
                return (
                  <div key={c.name} style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ fontSize:16, width:24 }}>{c.icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                        <span style={{ fontSize:12, color:"#bbb" }}>{c.name}</span>
                        <span style={{ fontSize:12, color:c.color }}>{formatINR(c.total)}</span>
                      </div>
                      <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:99, height:5 }}>
                        <div style={{ width:`${w}%`, height:"100%", background:c.color, borderRadius:99, transition:"width 0.6s ease" }}/>
                      </div>
                    </div>
                    <span style={{ fontSize:11, color:"#555", width:30, textAlign:"right" }}>{w.toFixed(0)}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div style={{ display:"flex", gap:8, overflowX:"auto", marginTop:24, paddingBottom:4 }}>
          {["All", ...CATEGORIES.map(c=>c.name)].map(f => (
            <button key={f} onClick={()=>setFilter(f)} style={{
              background: filter===f ? "rgba(77,150,255,0.2)" : "transparent",
              border: `1px solid ${filter===f ? "#4d96ff" : "rgba(255,255,255,0.1)"}`,
              color: filter===f ? "#4d96ff" : "#666",
              borderRadius:99, padding:"5px 14px", fontSize:11,
              cursor:"pointer", whiteSpace:"nowrap", transition:"all 0.15s",
              letterSpacing:0.5,
            }}>
              {f === "All" ? "All" : CATEGORIES.find(c=>c.name===f)?.icon + " " + f}
            </button>
          ))}
        </div>

        {/* Expenses List */}
        <div style={{ marginTop:16, display:"flex", flexDirection:"column", gap:8 }}>
          {filtered.length === 0 && (
            <div style={{ textAlign:"center", color:"#444", padding:40, fontSize:14 }}>
              No expenses yet.<br/><span style={{ fontSize:28 }}>🌿</span>
            </div>
          )}
          {filtered.map((e, i) => {
            const cat = getCat(e.category);
            return (
              <div key={e.id} style={{
                background:"#13131f", border:"1px solid rgba(255,255,255,0.06)",
                borderRadius:14, padding:"14px 16px",
                display:"flex", alignItems:"center", gap:12,
                animation: `fadeIn 0.3s ease ${i*0.04}s both`,
                transition:"transform 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={el => { if(el.currentTarget) { el.currentTarget.style.transform="translateX(4px)"; el.currentTarget.style.boxShadow=`-3px 0 0 ${cat.color}`; }}}
              onMouseLeave={el => { if(el.currentTarget) { el.currentTarget.style.transform="translateX(0)"; el.currentTarget.style.boxShadow="none"; }}}
              >
                <style>{`@keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }`}</style>
                <div style={{
                  width:40, height:40, borderRadius:12, flexShrink:0,
                  background:cat.color+"22", display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:20, border:`1px solid ${cat.color}33`,
                }}>
                  {cat.icon}
                </div>
                <div style={{ flex:1, overflow:"hidden" }}>
                  <div style={{ fontSize:14, fontWeight:600, color:"#f0ece3", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{e.title}</div>
                  <div style={{ fontSize:11, color:"#555", marginTop:2 }}>{e.date} · {e.category}</div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontSize:16, fontWeight:700, color:cat.color }}>{formatINR(e.amount)}</div>
                  <button onClick={()=>deleteExpense(e.id)} style={{
                    background:"none", border:"none", color:"#333", cursor:"pointer",
                    fontSize:13, padding:"2px 4px", marginTop:2,
                    transition:"color 0.15s",
                  }}
                  onMouseEnter={el=>el.currentTarget.style.color="#ff6b6b"}
                  onMouseLeave={el=>el.currentTarget.style.color="#333"}
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Summary */}
        {expenses.length > 0 && (
          <div style={{
            marginTop:24, padding:16,
            background:"linear-gradient(135deg,rgba(77,150,255,0.08),rgba(107,203,119,0.08))",
            border:"1px solid rgba(255,255,255,0.06)", borderRadius:14,
            display:"grid", gridTemplateColumns:"1fr 1fr 1fr", textAlign:"center",
          }}>
            <div>
              <div style={{ fontSize:11, color:"#555", letterSpacing:1 }}>ENTRIES</div>
              <div style={{ fontSize:22, fontWeight:700, color:"#4d96ff", marginTop:4 }}>{expenses.length}</div>
            </div>
            <div style={{ borderLeft:"1px solid rgba(255,255,255,0.06)", borderRight:"1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize:11, color:"#555", letterSpacing:1 }}>AVERAGE</div>
              <div style={{ fontSize:22, fontWeight:700, color:"#ffd93d", marginTop:4 }}>{formatINR(total/expenses.length)}</div>
            </div>
            <div>
              <div style={{ fontSize:11, color:"#555", letterSpacing:1 }}>CATEGORIES</div>
              <div style={{ fontSize:22, fontWeight:700, color:"#cc5de8", marginTop:4 }}>{catTotals.length}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)",
  borderRadius:10, color:"#f0ece3", fontFamily:"Georgia,serif", fontSize:14,
  padding:"10px 14px", outline:"none", boxSizing:"border-box",
};
