import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, User, MapPin, Briefcase, Calendar, DollarSign, Percent, 
  FileText, TrendingUp, Users, ChevronDown, X, Upload, Database, 
  BarChart2, Grid, Award, Star, Package, 
  Filter, XCircle, ArrowUpRight, ArrowDownRight, Download, Home, 
  Menu, PlusCircle, Save, Cloud, UserCheck, Loader2, RefreshCw, 
  CheckCircle, AlertTriangle, Trash, Lock, 
  Unlock, Shield, Store, Lightbulb, ClipboardList, Target, Medal,
  FilePlus, ShoppingCart, GitCompare
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, onSnapshot, query, addDoc, writeBatch, getDoc, deleteDoc } from 'firebase/firestore';

// --- 1. CONFIGURACIÓN FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyA5Bn2ySGVdIaZzon4LdNVpVB2D5EZs3xI",
  authDomain: "crmry-c9565.firebaseapp.com",
  projectId: "crmry-c9565",
  storageBucket: "crmry-c9565.firebasestorage.app",
  messagingSenderId: "253004876132",
  appId: "1:253004876132:web:6df19b80568bf09de09271"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'crmry-c9565';
const APP_VERSION = "v4.0.0 (2026) - Optimizado";

// --- LISTA OPCIONES EXPO ---
const EXPO_OPTIONS = [
    "Nada", "Vitale", "Sansa", "Vora", "Econic", "Alfa", "Bassi", "Win", 
    "Cheap", "Logika", "Essence", "Mio", "Niwa", "Tuyo", "Urban", 
    "Vida", "Wave", "Dai", "Cortesía"
];

// --- LISTA SERIES A CONTAR ---
const SERIES_TO_COUNT = [
   "Vitale", "Sansa", "Vora", "Econic", "Alfa", "Bassi", "Win", 
   "Cheap", "Logika", "Essence", "Mio", "Niwa", "Tuyo", "Urban", 
   "Vida", "Wave", "Dai", "Cortesía"
];

// --- 2. UTILIDADES Y FORMATEO ---

function safeRender(value, fallback = "-") {
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'object') return fallback;
    return value;
}

function safeString(val) {
    if (val === null || val === undefined) return "";
    if (typeof val === 'object') return ""; 
    return String(val).trim();
}

function safeNumber(val) {
    if (val === null || val === undefined || val === "") return 0;
    if (typeof val === 'object') return 0;
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
}

function formatPercentage(value) {
  if (value === undefined || value === null || value === "") return "-";
  let num = typeof value === 'string' ? parseFloat(value.replace('%', '').replace(',', '.')) : value;
  if (isNaN(num)) return "-";
  if (num <= 1 && num !== 0 && num >= -1) num = num * 100;
  return num.toFixed(2) + '%';
}

function parsePercentageValue(value) {
  return safeNumber(value);
}

function getMerskaColorClass(pot, ry) {
    if (!pot && !ry) return "text-gray-500";
    const nPot = parseFloat(pot) || 0;
    const nRy = parseFloat(ry) || 0;
    if (nPot === 0 && nRy === 0) return "text-gray-500";
    return nRy > nPot ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50";
}

function formatCurrency(val) {
    const num = safeNumber(val);
    return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " €";
}

function calculateGrowth(v25, v26) {
    if (!v25 && !v26) return 0;
    if (!v25) return v26 > 0 ? 100 : 0; 
    return ((v26 - v25) / v25) * 100;
}

function parseDateObj(dateInput) {
  if (!dateInput) return null;
  if (dateInput && typeof dateInput.toDate === 'function') {
      return dateInput.toDate();
  }
  if (dateInput instanceof Date && !isNaN(dateInput)) return dateInput;
   
  const str = String(dateInput).trim();
  const isoMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
     return new Date(
       parseInt(isoMatch[1], 10),
       parseInt(isoMatch[2], 10) - 1, 
       parseInt(isoMatch[3], 10),
       12, 0, 0 
     );
  }
  if (!isNaN(str) && parseFloat(str) > 20000) {
      const date = new Date(Math.round((parseFloat(str) - 25569) * 86400 * 1000));
      return !isNaN(date.getTime()) ? date : null;
  }
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

function formatDate(dateInput) {
    const date = parseDateObj(dateInput);
    return date ? date.toLocaleDateString('es-ES') : safeString(dateInput);
}

// --- 3. GENERADOR DE INFORMES AVANZADO ---
function generateAutomatedReport(type, data, contextName = "") {
    let points = [];
    let actions = [];
    const total25 = Array.isArray(data) ? data.reduce((sum, item) => sum + (item.VTA_2025 || 0), 0) : (data.VTA_2025 || 0);
    const total26 = Array.isArray(data) ? data.reduce((sum, item) => sum + (item.VTA_2026 || 0), 0) : (data.VTA_2026 || 0);
    const growth = calculateGrowth(total25, total26);
    
    if (type === 'CLIENT') {
        const c = data;
        const modPct = total26 > 0 ? ((c.MOD_26 || 0) / total26) * 100 : 0;
        const hasExpo = c.EXPO_ROYO && c.EXPO_ROYO !== "No" && c.EXPO_ROYO !== "Nada";
        const lastVisit = parseDateObj(c.F_VISITA);
        const daysSinceVisit = lastVisit ? Math.floor((new Date() - lastVisit) / (1000 * 60 * 60 * 24)) : 999;
        const isInactive = safeString(c.CLIENTE).toUpperCase().startsWith('XXX');

        if (isInactive) {
             points.push(`🔴 CUENTA DE BAJA (XXX): Histórico mantenido.`);
        } else {
             points.push(`📊 Situación 26: ${growth < 0 ? 'Caída' : 'Crecimiento'} del ${Math.abs(growth).toFixed(1)}% (${formatCurrency(total26)}).`);
        }
        
        if (!isInactive) {
            if (daysSinceVisit > 90) {
                points.push(`⚠️ Alerta: Cliente desatendido hace ${daysSinceVisit} días.`);
                actions.push("Prioridad ALTA: Llamar o visitar esta semana.");
            } else {
                points.push(`✅ Visita reciente: ${formatDate(c.F_VISITA)}.`);
            }
            if (!hasExpo) {
                points.push(`❌ Sin exposición de producto.`);
                actions.push("Objetivo: Cerrar acuerdo para expo.");
            }
            if (modPct < 15 && total26 > 0) {
                actions.push("Oportunidad: Compra poco Modular. Presentar catálogo.");
            }
            if (c.VTA_2025 > 2000 && c.VTA_2026 === 0) {
                points.push(`🚨 CLIENTE PERDIDO: Facturó ${formatCurrency(c.VTA_2025)} en 2025 y 0€ ahora.`);
                actions.push("Investigar motivo de la pérdida urgentemente.");
            }
        } else {
            actions.push("Cuenta inactiva: No requiere acciones.");
        }
    } else {
        if (type === 'GLOBAL' || type === 'PROVINCE') {
             const agents = {};
             data.forEach(d => {
                 const ag = safeString(d.COMERCIAL) || "Sin Asignar";
                 if(!agents[ag]) agents[ag] = { v25: 0, v26: 0 };
                 agents[ag].v25 += d.VTA_2025;
                 agents[ag].v26 += d.VTA_2026;
             });
             const agentList = Object.entries(agents).map(([name, v]) => ({ name, diff: v.v26 - v.v25 }));
             const bestAgent = [...agentList].sort((a,b) => b.diff - a.diff)[0];
             const worstAgent = [...agentList].sort((a,b) => a.diff - b.diff)[0];

             if(bestAgent && bestAgent.diff > 0) points.push(`🏆 Mejor arranque 26: ${bestAgent.name} crece +${formatCurrency(bestAgent.diff)}.`);
             if(worstAgent && worstAgent.diff < 0) points.push(`📉 Mayor caída 26: ${worstAgent.name} pierde ${formatCurrency(Math.abs(worstAgent.diff))}.`);
        }
        const lostClients = data.filter(c => c.VTA_2025 > 3000 && c.VTA_2026 === 0 && !safeString(c.CLIENTE).toUpperCase().startsWith('XXX'));
        if (lostClients.length > 0) {
            const topLost = lostClients.sort((a,b) => b.VTA_2025 - a.VTA_2025)[0];
            points.push(`⚠️ Alerta Fuga: ${lostClients.length} cuentas a 0€ en 2026.`);
            actions.push(`RECUPERACIÓN: Contactar a ${safeString(topLost.CLIENTE)}.`);
        }
        const activeClients = data.filter(c => c.VTA_2026 > 0).length;
        points.push(`👥 Cartera Activa 26: ${activeClients} de ${data.length} clientes.`);
    }

    const genericPoints = ["Comparativa interanual 25-26 en curso.", "Analizando mix de producto 2026.", "Márgenes estables.", "Ratio de conversión estable.", "Satisfacción positiva."];
    const genericActions = ["Monitorizar arranque semanalmente.", "Comunicar objetivos 2026.", "Analizar competencia.", "Actualizar material venta.", "Revisar stock."];
    const clientGenericPoints = ["Pagos sin incidencias.", "Ubicación estratégica.", "Potencial crecimiento.", "Buena predisposición.", "Estructura estable."];
    const clientGenericActions = ["Enviar tarifas 2026.", "Llamada de cortesía.", "Verificar expositores.", "Invitar a showroom.", "Comparativa precios."];

    const targetPoints = type === 'CLIENT' ? clientGenericPoints : genericPoints;
    const targetActions = type === 'CLIENT' ? clientGenericActions : genericActions;

    let pIndex = 0;
    while (points.length < 5 && pIndex < targetPoints.length) { if (!points.includes(targetPoints[pIndex])) points.push(targetPoints[pIndex]); pIndex++; }
    let aIndex = 0;
    while (actions.length < 5 && aIndex < targetActions.length) { if (!actions.includes(targetActions[aIndex])) actions.push(targetActions[aIndex]); aIndex++; }

    return { points: points.slice(0, 5), actions: actions.slice(0, 5) };
}

// --- 4. NORMALIZACIÓN DE DATOS ---
function normalizeData(rawData, type) {
  return rawData.map(row => {
    const normalizeKey = (k) => k.trim().toUpperCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
        .replace(/\s+/g, '_').replace(/\./g, '').replace(/º/g, '');
        
    const rowNormalized = {};
    Object.keys(row).forEach(k => rowNormalized[normalizeKey(k)] = row[k]);
    const mappedRow = {};

    const findKey = (keywords) => Object.keys(rowNormalized).find(k => keywords.some(kw => k.includes(kw)));

    if (type === 'CRM') {
        mappedRow.CLIENTE = safeString(rowNormalized.CLIENTE || rowNormalized.NOMBRE);
        mappedRow.N_CLIENTE = safeString(rowNormalized.N_CLIENTE || rowNormalized.NUMERO_CLIENTE);
        mappedRow.PAGADOR = safeString(rowNormalized.PAGADOR);
        mappedRow.GRUPO = safeString(rowNormalized.GRUPO);
        mappedRow.RC = safeString(rowNormalized.RC) || "NO";
        mappedRow.CIUDAD = safeString(rowNormalized.CIUDAD || rowNormalized.POBLACION);
        mappedRow.PROVINCIA = safeString(rowNormalized.PROVINCIA);
        mappedRow.COMERCIAL = safeString(rowNormalized.COMERCIAL || rowNormalized.AGENTE);
        mappedRow.SUBAGENTE = safeString(rowNormalized.SUBAGENTE);
        mappedRow.DESCUENTOS = safeString(rowNormalized.DESCUENTOS);
        mappedRow.PAGO = safeString(rowNormalized.PAGO);
        mappedRow.PROMOCIONES = safeString(rowNormalized.PROMOCIONES);
        mappedRow.EXPO_ROYO = safeString(rowNormalized.EXPO_ROYO);
        mappedRow.COMPRADOR = safeString(rowNormalized.COMPRADOR);
        mappedRow.NOTA_VISITA = safeString(rowNormalized.NOTA_VISITA || rowNormalized.COMENTARIOS);
        mappedRow.F_VISITA = safeString(rowNormalized.F_VISITA || rowNormalized.FECHA_VISITA);
        mappedRow.VTA_2024 = safeNumber(rowNormalized['2024'] || rowNormalized.VENTAS_2024);
        mappedRow.VTA_2025 = safeNumber(rowNormalized['2025'] || rowNormalized.VENTAS_2025);
        mappedRow.VTA_2026 = safeNumber(rowNormalized['2026'] || rowNormalized.VENTAS_2026);
        mappedRow.T_24 = safeNumber(rowNormalized.T_24 || rowNormalized.T24 || rowNormalized.TOTAL_2024);
        mappedRow.T_25 = safeNumber(rowNormalized.T_25 || rowNormalized.T25 || rowNormalized.TOTAL_2025);
        mappedRow.PRE_26 = safeNumber(rowNormalized.PRE_26 || rowNormalized.PREVISION);
        mappedRow.TUYO_26 = safeNumber(rowNormalized.TUYO_26 || rowNormalized.TUYO);
        mappedRow.TUYO_25 = safeNumber(rowNormalized.TUYO_25 || rowNormalized.TUYO_2025);
        mappedRow.MOD_25 = safeNumber(rowNormalized.MOD_25 || rowNormalized.MODULAR_25 || rowNormalized.MOD_PCT_25 || rowNormalized['MOD_%_25']);
        mappedRow.MOD_26 = safeNumber(rowNormalized.MOD_26 || rowNormalized.MODULAR_26 || rowNormalized.MOD_PCT_26 || rowNormalized['MOD_%_26']);
    } else if (type === 'SERIES') {
        mappedRow.CLIENTE = safeString(rowNormalized.CLIENTE);
        mappedRow.SERIE = safeString(rowNormalized.SERIE || rowNormalized.MODELO);
        mappedRow.VTA_2024 = safeNumber(rowNormalized['2024']);
        mappedRow.VTA_2025 = safeNumber(rowNormalized['2025']);
        mappedRow.VTA_2026 = safeNumber(rowNormalized['2026']);
    } else if (type === 'PROMOS') {
        const comercialKey = findKey(['COMERCIAL', 'AGENTE', 'VENDEDOR', 'REPRESENTANTE']);
        const promocionKey = findKey(['PROMOCION', 'PROMO', 'CAMPAÑA', 'FAMILIA']);
        const anoKey = findKey(['ANO', 'YEAR', 'EJERCICIO']);
        const puestoKey = findKey(['PUESTO', 'RANKING', 'POSICION']);
        const unidKey = findKey(['UNID', 'CANTIDAD', 'VENTAS']);

        mappedRow.COMERCIAL = safeString(rowNormalized[comercialKey]);
        mappedRow.PROMOCION = safeString(rowNormalized[promocionKey]);
        mappedRow.ANO = safeString(rowNormalized[anoKey]);
        mappedRow.PUESTO = safeNumber(rowNormalized[puestoKey]);
        mappedRow.UNID = safeNumber(rowNormalized[unidKey]);
    } else if (type === 'OFERTAS') {
        mappedRow.CLIENTE = safeString(rowNormalized.CLIENTE);
        mappedRow.APROBADO = safeString(rowNormalized.APROBADO) || "Pen";
        mappedRow.ANO = safeString(rowNormalized.ANO || rowNormalized.AÑO);
        mappedRow.MODELO = safeString(rowNormalized.MODELO || rowNormalized.SERIE);
        mappedRow.UNIDADES = safeNumber(rowNormalized.UNIDADES || rowNormalized.CANTIDAD);
        mappedRow.ADICIONAL = safeString(rowNormalized.ADICIONAL || rowNormalized.DESCUENTO);
    } else if (type === 'INCIDENCIAS') {
        mappedRow.CLIENTE = safeString(rowNormalized.CLIENTE);
        mappedRow.ANO = safeString(rowNormalized.ANO || rowNormalized.AÑO);
        mappedRow.MOTIVO = safeString(rowNormalized.MOTIVO);
        mappedRow.VECES = safeNumber(rowNormalized.VECES); 
        mappedRow.DEMERITO = safeNumber(rowNormalized.DEMERITO);
        mappedRow.DESCUENTO = safeNumber(rowNormalized.DESCUENTO);
    } else if (type === 'MERSKA') {
        mappedRow.PROVINCIA = safeString(rowNormalized.PROVINCIA);
        mappedRow.M_POT = safeNumber(rowNormalized.M_POT);
        mappedRow.M_RY = safeNumber(rowNormalized.M_RY);
        mappedRow.M_OB = safeNumber(rowNormalized.M_OB);
    }
    return mappedRow;
  });
}

// --- COMPONENTES UI ---
const GrowthIndicator = ({ v25, v26, lightMode = false, showLabel = false, labelText }) => {
    const growth = calculateGrowth(v25, v26);
    const isNegative = growth < 0;
    const isZero = v25 === 0 && v26 === 0;
    if (isZero) return <span className={`text-xs ${lightMode ? 'text-slate-400' : 'text-gray-300'}`}>-</span>;
    const colorClass = lightMode ? (isNegative ? 'text-red-400' : 'text-emerald-400') : (isNegative ? 'text-red-600' : 'text-emerald-600');
    return (
        <div className={`flex flex-col items-end ${colorClass}`}>
            <span className="flex items-center gap-1 font-bold text-xs">{isNegative ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}{Math.abs(growth).toFixed(1)}%</span>
            {showLabel && <span className={`text-[9px] uppercase font-semibold opacity-70 ${lightMode ? 'text-slate-400' : 'text-gray-400'}`}>{labelText || 'vs 2025'}</span>}
        </div>
    );
};

const SectionHeader = ({ title }) => (<h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 mt-6 border-b pb-1">{title}</h3>);

const InfoCard = ({ icon: Icon, label, value, subValue, highlight = false, alert = false }) => (
  <div className={`p-4 rounded-xl border ${highlight ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-100'} ${alert ? 'border-l-4 border-l-orange-500' : ''} shadow-sm hover:shadow-md transition-shadow`}>
    <div className="flex items-center gap-2 mb-2">
      {Icon && <Icon className={`w-4 h-4 ${highlight ? 'text-blue-600' : 'text-gray-400'}`} />}
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</span>
    </div>
    <div className={`text-sm font-medium ${highlight ? 'text-blue-900 text-lg' : 'text-gray-900'} truncate`} title={safeString(value)}>{safeRender(value)}</div>
    {subValue && <div className="text-xs text-gray-500 mt-1">{subValue}</div>}
  </div>
);

const AutomaticReportModal = ({ isOpen, onClose, data, type, contextName }) => {
    const [report, setReport] = useState({ points: [], actions: [] });
    const [copied, setCopied] = useState(false);
    useEffect(() => { if (isOpen && data) setReport(generateAutomatedReport(type, data, contextName)); }, [isOpen, data, type, contextName]);
    const handleCopy = () => {
        const text = `INFORME ESTRATÉGICO - ${type} ${contextName}\n\n` + `PUNTOS CLAVE:\n${report.points.map(p => `- ${p}`).join('\n')}\n\n` + `PLAN DE ACCIÓN:\n${report.actions.map(a => `[ ] ${a}`).join('\n')}`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 z-[80] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in-up">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="bg-gradient-to-r from-blue-900 to-slate-900 p-6 flex justify-between items-center text-white shrink-0">
                    <div><h3 className="font-bold text-xl flex items-center gap-2"><Lightbulb className="w-6 h-6 text-yellow-400" /> Informe Ejecutivo IA (2026)</h3><p className="text-blue-200 text-sm mt-1">Análisis automático basado en datos reales</p></div>
                    <button onClick={onClose} className="text-blue-200 hover:text-white bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-6 overflow-y-auto space-y-6 bg-slate-50">
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm"><h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2"><BarChart2 className="w-4 h-4 text-blue-600" /> Diagnóstico de Situación</h4><ul className="space-y-3">{report.points.map((point, idx) => (<li key={idx} className="flex items-start gap-3 text-gray-700 text-sm leading-relaxed"><span className="bg-blue-100 text-blue-700 font-bold text-xs w-6 h-6 flex items-center justify-center rounded-full shrink-0 mt-0.5">{idx + 1}</span>{point}</li>))}</ul></div>
                    <div className="bg-white p-5 rounded-xl border border-green-200 shadow-sm border-l-4 border-l-green-500"><h4 className="text-sm font-bold text-green-700 uppercase tracking-widest mb-4 flex items-center gap-2"><Target className="w-4 h-4" /> Plan de Acción Recomendado</h4><ul className="space-y-3">{report.actions.map((action, idx) => (<li key={idx} className="flex items-start gap-3 text-gray-800 font-medium text-sm leading-relaxed"><div className="mt-1 w-4 h-4 border-2 border-green-400 rounded flex items-center justify-center shrink-0"></div>{action}</li>))}</ul></div>
                </div>
                <div className="p-4 border-t border-gray-200 bg-white flex justify-end gap-3"><button onClick={onClose} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg font-medium">Cerrar</button><button onClick={handleCopy} className={`px-6 py-2 rounded-lg font-bold text-white flex items-center gap-2 transition-all ${copied ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}>{copied ? <><CheckCircle className="w-4 h-4" /> Copiado</> : <><ClipboardList className="w-4 h-4" /> Copiar Informe</>}</button></div>
            </div>
        </div>
    );
};

const CompactBarChart = ({ data }) => {
    const allValues = data.flatMap(d => [d.VTA_2024, d.VTA_2025, d.VTA_2026]);
    const maxVal = Math.max(...allValues, 100);
    const formatVal = (v) => v >= 1000 ? (v/1000).toFixed(1) + 'k' : v;
    return (
      <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm mt-2">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest"><BarChart2 className="w-4 h-4" /> Evolución Top Series (24-26)</div>
          <div className="flex gap-3 text-[10px] font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
              <div className="flex items-center gap-1"><div className="w-2 h-2 bg-slate-300 rounded-full"></div> '24</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-600 rounded-full"></div> '25</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-400 rounded-full"></div> '26</div>
          </div>
        </div>
        <div className="flex justify-between items-end h-64 w-full relative pt-6">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-30 top-6">{[...Array(4)].map((_, i) => <div key={i} className="border-t border-dashed border-gray-200 w-full h-0"></div>)}</div>
          {data.map((d, i) => (
            <div key={i} className="flex flex-col items-center justify-end h-full w-full mx-1 z-10 relative">
              <div className="flex items-end justify-center w-full h-full gap-[2px] px-1 rounded-t-lg pb-6">
                 {[d.VTA_2024, d.VTA_2025, d.VTA_2026].map((val, idx) => {
                     const colors = ['bg-slate-300', 'bg-blue-600', 'bg-emerald-400'];
                     const textColors = ['text-slate-500', 'text-blue-600', 'text-emerald-600'];
                     return (<div key={idx} className="relative flex-1 flex items-end h-full group">{val > 0 && (<div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-1 text-[9px] font-bold ${textColors[idx]} -rotate-45 origin-bottom-left whitespace-nowrap`}>{formatVal(val)}€</div>)}<div className={`w-full ${colors[idx]} rounded-t-[2px] hover:opacity-80 transition-opacity`} style={{ height: `${(val / maxVal) * 100}%` }}></div></div>)
                 })}
              </div>
              <div className="absolute bottom-0 w-full text-center pb-1 border-t border-gray-100 pt-1"><span className="text-[10px] font-bold text-gray-700 truncate block w-full px-0.5 leading-tight" title={safeString(d.SERIE)}>{safeString(d.SERIE)}</span></div>
            </div>
          ))}
        </div>
      </div>
    );
};

// --- VISTAS ESPECÍFICAS ---

const NewQuoteModal = ({ isOpen, onClose, clients, onSave }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClient, setSelectedClient] = useState(null);
    const [model, setModel] = useState("");
    const [units, setUnits] = useState("");
    const [additional, setAdditional] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => { 
        if(isOpen) { 
            setDate(new Date().toISOString().split('T')[0]); 
            setSearchTerm(""); 
            setSelectedClient(null); 
            setModel(""); 
            setUnits(""); 
            setAdditional(""); 
            setSaving(false); 
        } 
    }, [isOpen]);

    useEffect(() => { 
        function handleClickOutside(event) { 
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setShowSuggestions(false); 
        } 
        document.addEventListener("mousedown", handleClickOutside); 
        return () => document.removeEventListener("mousedown", handleClickOutside); 
    }, []);

    const filteredClients = useMemo(() => { 
        if (!searchTerm) return []; 
        return clients.filter(c => (c.CLIENTE && c.CLIENTE.toLowerCase().includes(searchTerm.toLowerCase()))).slice(0, 10); 
    }, [clients, searchTerm]);

    const handleSelectClient = (c) => { setSelectedClient(c); setSearchTerm(c.CLIENTE); setShowSuggestions(false); };

    const handleSave = async () => { 
        if (!selectedClient) { alert("Selecciona un cliente."); return; } 
        if (!model.trim()) { alert("Indica el modelo/serie."); return; }
        if (!units) { alert("Indica las unidades."); return; }
        
        setSaving(true); 
        await onSave({ 
            clientName: selectedClient.CLIENTE, 
            nClient: selectedClient.N_CLIENTE, 
            date: date, 
            model: model, 
            units: units, 
            additional: additional,
            approved: "Pen",
            year: date.substring(0, 4)
        }); 
        setSaving(false); 
        onClose(); 
    };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
               <div className="bg-purple-600 p-4 flex justify-between items-center text-white shrink-0"><h3 className="font-bold text-lg flex items-center gap-2"><FilePlus className="w-5 h-5" /> Nueva Cotización</h3><button onClick={onClose} className="text-purple-100 hover:text-white"><X className="w-6 h-6" /></button></div>
               <div className="p-6 space-y-4 overflow-y-auto">
                   <div><label className="block text-sm font-bold text-gray-700 mb-1">Fecha</label><input type="date" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" value={date} onChange={(e) => setDate(e.target.value)} /></div>
                   <div className="relative" ref={wrapperRef}>
                       <label className="block text-sm font-bold text-gray-700 mb-1">Cliente</label>
                       <div className="relative"><input type="text" className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" placeholder="Buscar cliente..." value={selectedClient ? selectedClient.CLIENTE : searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setSelectedClient(null); setShowSuggestions(true); }} onFocus={() => setShowSuggestions(true)} /><Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />{selectedClient && (<button className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600" onClick={() => { setSelectedClient(null); setSearchTerm(""); }}><XCircle className="w-5 h-5" /></button>)}</div>
                       {showSuggestions && !selectedClient && filteredClients.length > 0 && (<div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">{filteredClients.map((c, i) => (<div key={i} className="p-3 hover:bg-purple-50 cursor-pointer border-b last:border-0" onClick={() => handleSelectClient(c)}><div className="font-medium text-gray-800">{c.CLIENTE}</div><div className="text-xs text-gray-500">{c.CIUDAD}</div></div>))}</div>)}
                   </div>
                   <div><label className="block text-sm font-bold text-gray-700 mb-1">Modelo / Serie</label><input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" placeholder="Ej: Vitale, Sansa..." value={model} onChange={(e) => setModel(e.target.value)} /></div>
                   <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-bold text-gray-700 mb-1">Unidades</label><input type="number" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" placeholder="0" value={units} onChange={(e) => setUnits(e.target.value)} /></div>
                        <div><label className="block text-sm font-bold text-gray-700 mb-1">Dto. Adicional</label><input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" placeholder="Ej: 10%" value={additional} onChange={(e) => setAdditional(e.target.value)} /></div>
                   </div>
                   <div className="flex gap-3 pt-2"><button onClick={onClose} className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50">Cancelar</button><button onClick={handleSave} disabled={saving} className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 flex items-center justify-center gap-2 shadow-lg disabled:bg-purple-400">{saving ? "Guardando..." : <><Save className="w-5 h-5" /> Guardar</>}</button></div>
               </div>
            </div>
        </div>
    );
};

const NewVisitModal = ({ isOpen, onClose, clients, onSave }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [reminderDate, setReminderDate] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClient, setSelectedClient] = useState(null);
    const [contact, setContact] = useState("");
    const [note, setNote] = useState("");
    const [promotions, setPromotions] = useState(""); 
    const [expo, setExpo] = useState([]); 
    const [showExpoDropdown, setShowExpoDropdown] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);
    const expoRef = useRef(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => { if(isOpen) { setDate(new Date().toISOString().split('T')[0]); setReminderDate(""); setSearchTerm(""); setSelectedClient(null); setContact(""); setNote(""); setPromotions(""); setExpo([]); setShowExpoDropdown(false); setSaving(false); } }, [isOpen]);
    useEffect(() => { function handleClickOutside(event) { if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setShowSuggestions(false); if (expoRef.current && !expoRef.current.contains(event.target)) setShowExpoDropdown(false); } document.addEventListener("mousedown", handleClickOutside); return () => document.removeEventListener("mousedown", handleClickOutside); }, []);

    const filteredClients = useMemo(() => { if (!searchTerm) return []; return clients.filter(c => (c.CLIENTE && c.CLIENTE.toLowerCase().includes(searchTerm.toLowerCase()))).slice(0, 10); }, [clients, searchTerm]);
    const handleSelectClient = (c) => { setSelectedClient(c); setSearchTerm(c.CLIENTE); setContact(c.COMPRADOR || ""); setShowSuggestions(false); };
    const handleExpoChange = (option) => { let newExpo = [...expo]; if (option === "Nada") { if (newExpo.includes("Nada")) { newExpo = []; } else { newExpo = ["Nada"]; } } else { newExpo = newExpo.filter(item => item !== "Nada"); if (newExpo.includes(option)) { newExpo = newExpo.filter(item => item !== option); } else { newExpo.push(option); } } setExpo(newExpo); };
    const handleSave = async () => { if (!selectedClient) { alert("Por favor selecciona un cliente."); return; } if (!note.trim()) { alert("Por favor escribe una nota."); return; } setSaving(true); const expoString = expo.join(", "); await onSave({ clientName: selectedClient.CLIENTE, nClient: selectedClient.N_CLIENTE, date: date, reminderDate: reminderDate, contact: contact, note: note, promotions: promotions, expo: expoString }); setSaving(false); onClose(); };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
               <div className="bg-blue-600 p-4 flex justify-between items-center text-white shrink-0"><h3 className="font-bold text-lg flex items-center gap-2"><PlusCircle className="w-5 h-5" /> Nueva Visita</h3><button onClick={onClose} className="text-blue-100 hover:text-white"><X className="w-6 h-6" /></button></div>
               <div className="p-6 space-y-4 overflow-y-auto">
                   <div className="grid grid-cols-2 gap-4">
                       <div><label className="block text-sm font-bold text-gray-700 mb-1">Fecha de Visita</label><input type="date" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={date} onChange={(e) => setDate(e.target.value)} /></div>
                       <div><label className="block text-sm font-bold text-gray-700 mb-1">Recordatorio (Opcional)</label><input type="date" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={reminderDate} onChange={(e) => setReminderDate(e.target.value)} /></div>
                   </div>
                   <div className="relative" ref={wrapperRef}>
                       <label className="block text-sm font-bold text-gray-700 mb-1">Cliente</label>
                       <div className="relative"><input type="text" className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Buscar cliente..." value={selectedClient ? selectedClient.CLIENTE : searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setSelectedClient(null); setContact(""); setShowSuggestions(true); }} onFocus={() => setShowSuggestions(true)} /><Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />{selectedClient && (<button className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600" onClick={() => { setSelectedClient(null); setSearchTerm(""); setContact(""); }}><XCircle className="w-5 h-5" /></button>)}</div>
                       {showSuggestions && !selectedClient && filteredClients.length > 0 && (<div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">{filteredClients.map((c, i) => (<div key={i} className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-0" onClick={() => handleSelectClient(c)}><div className="font-medium text-gray-800">{c.CLIENTE}</div><div className="text-xs text-gray-500">{c.CIUDAD}</div></div>))}</div>)}
                   </div>
                   <div><label className="block text-sm font-bold text-gray-700 mb-1">Persona de Contacto / Comprador</label><div className="relative"><input type="text" className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Nombre de la persona atendida..." value={contact} onChange={(e) => setContact(e.target.value)} /><UserCheck className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" /></div><p className="text-xs text-gray-500 mt-1">Este nombre se actualizará en la ficha del cliente.</p></div>
                   <div><label className="block text-sm font-bold text-gray-700 mb-1">Nota / Resumen</label><textarea className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none" placeholder="Detalles de la visita..." value={note} onChange={(e) => setNote(e.target.value)}></textarea></div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div><label className="block text-sm font-bold text-gray-700 mb-1">Promociones</label><textarea className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-20 resize-none" placeholder="Ofertas activas o propuestas..." value={promotions} onChange={(e) => setPromotions(e.target.value)}></textarea></div>
                       <div className="relative" ref={expoRef}><label className="block text-sm font-bold text-gray-700 mb-1">Expo Royo (Selección Múltiple)</label><div className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white h-20 overflow-y-auto cursor-pointer flex flex-wrap gap-1 content-start" onClick={() => setShowExpoDropdown(!showExpoDropdown)}>{expo.length === 0 && <span className="text-gray-400">Seleccionar series...</span>}{expo.map((item, idx) => (<span key={idx} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full border border-purple-200">{item}</span>))}<div className="absolute right-3 top-9 text-gray-400 pointer-events-none"><ChevronDown className="w-4 h-4" /></div></div>{showExpoDropdown && (<div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto p-2">{EXPO_OPTIONS.map((opt, i) => { const isChecked = expo.includes(opt); return (<div key={i} className={`flex items-center gap-3 p-2 hover:bg-purple-50 rounded cursor-pointer ${isChecked ? 'bg-purple-50' : ''}`} onClick={() => handleExpoChange(opt)}><div className={`w-5 h-5 rounded border flex items-center justify-center ${isChecked ? 'bg-purple-600 border-purple-600' : 'border-gray-300 bg-white'}`}>{isChecked && <CheckCircle className="w-3.5 h-3.5 text-white" />}</div><span className={`text-sm ${isChecked ? 'font-bold text-purple-900' : 'text-gray-700'}`}>{opt}</span></div>)})}</div>)}</div>
                   </div>
                   <div className="flex gap-3 pt-2"><button onClick={onClose} className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50">Cancelar</button><button onClick={handleSave} disabled={saving} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 flex items-center justify-center gap-2 shadow-lg disabled:bg-blue-400">{saving ? "Guardando..." : <><Save className="w-5 h-5" /> Guardar</>}</button></div>
               </div>
            </div>
        </div>
    );
};

const HomeView = ({ data, seriesData, merskaData }) => {
    const [showReport, setShowReport] = useState(false);
    const [showAnnual, setShowAnnual] = useState(false);

    const totals = useMemo(() => {
        const t24 = data.reduce((acc, curr) => acc + curr.VTA_2024, 0);
        const t25 = data.reduce((acc, curr) => acc + curr.VTA_2025, 0);
        const t26 = data.reduce((acc, curr) => acc + curr.VTA_2026, 0);
        const t_24 = data.reduce((acc, curr) => acc + (curr.T_24 || 0), 0);
        const t_25 = data.reduce((acc, curr) => acc + (curr.T_25 || 0), 0);
        const mod25 = data.reduce((acc, curr) => acc + (curr.MOD_25 || 0), 0);
        const mod26 = data.reduce((acc, curr) => acc + (curr.MOD_26 || 0), 0);
        
        const t_25_denom = t_25 > 0 ? t_25 : t25;
        const pctMod25 = t_25_denom > 0 ? (mod25 / t_25_denom) * 100 : 0;
        
        const pctMod26 = t26 > 0 ? (mod26 / t26) * 100 : 0;
        
        return { t24, t25, t26, t_24, t_25, pctMod25, pctMod26 };
    }, [data]);

    const agents = useMemo(() => {
        const grouped = {};
        data.forEach(c => {
            const ag = safeString(c.COMERCIAL) || "Sin Asignar";
            if (!grouped[ag]) grouped[ag] = { name: ag, v24: 0, v25: 0, v26: 0, t_24: 0, t_25: 0 };
            grouped[ag].v24 += c.VTA_2024;
            grouped[ag].v25 += c.VTA_2025;
            grouped[ag].v26 += c.VTA_2026;
            grouped[ag].t_24 += (c.T_24 || 0);
            grouped[ag].t_25 += (c.T_25 || 0);
        });
        return Object.values(grouped).sort((a,b) => b.v25 - a.v25);
    }, [data]);

    const provinces = useMemo(() => {
        const grouped = {};
        data.forEach(c => {
            const pr = safeString(c.PROVINCIA) || "Sin Provincia";
            if (!grouped[pr]) {
                const mInfo = (merskaData || []).find(m => safeString(m.PROVINCIA).toUpperCase() === pr.toUpperCase()) || {};
                grouped[pr] = { name: pr, v24: 0, v25: 0, v26: 0, t_24: 0, t_25: 0, m_pot: mInfo.M_POT, m_ry: mInfo.M_RY };
            }
            grouped[pr].v24 += c.VTA_2024;
            grouped[pr].v25 += c.VTA_2025;
            grouped[pr].v26 += c.VTA_2026;
            grouped[pr].t_24 += (c.T_24 || 0);
            grouped[pr].t_25 += (c.T_25 || 0);
        });
        return Object.values(grouped).sort((a,b) => b.v25 - a.v25);
    }, [data, merskaData]);

    const topClients = useMemo(() => [...data].sort((a,b) => (b.T_25 || 0) - (a.T_25 || 0)).slice(0, 10), [data]);

    const topSeries = useMemo(() => {
        const grouped = {};
        seriesData.forEach(s => {
            const serieName = safeString(s.SERIE);
            if (!grouped[serieName]) grouped[serieName] = { SERIE: serieName, v24: 0, v25: 0, v26: 0 };
            grouped[serieName].v24 += s.VTA_2024;
            grouped[serieName].v25 += s.VTA_2025;
            grouped[serieName].v26 += s.VTA_2026;
        });
        return Object.values(grouped).sort((a,b) => b.v25 - a.v25).slice(0, 10);
    }, [seriesData]);

    const exposureCounts = useMemo(() => {
        const counts = {};
        SERIES_TO_COUNT.forEach(s => counts[s] = 0);
        data.forEach(client => {
            const expoString = safeString(client.EXPO_ROYO);
            if (!expoString || expoString === "Nada" || expoString === "No") return;
            const currentExpos = expoString.split(',').map(s => s.trim());
            currentExpos.forEach(expoItem => { if (counts.hasOwnProperty(expoItem)) counts[expoItem]++; });
        });
        return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
    }, [data]);

    const totalExposures = useMemo(() => exposureCounts.reduce((acc, item) => acc + item.count, 0), [exposureCounts]);

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-xl font-bold text-gray-800">Comparativa 2024-2026</h2>
                <div className="flex gap-2">
                    <button onClick={() => setShowAnnual(!showAnnual)} className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors shadow-sm ${showAnnual ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                        {showAnnual ? 'Cierre Anual' : 'Ver YTD'}
                    </button>
                    <button onClick={() => setShowReport(true)} className="flex items-center gap-2 bg-gradient-to-r from-blue-700 to-indigo-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all font-bold text-sm"><Lightbulb className="w-4 h-4 text-yellow-300" /> Informe IA</button>
                </div>
            </div>
            <AutomaticReportModal isOpen={showReport} onClose={() => setShowReport(false)} data={data} type="GLOBAL" contextName="General" />
            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl overflow-hidden relative">
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-10 -mr-16 -mt-16"></div>
               <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
                   <div><p className="text-xs font-bold text-slate-400 uppercase mb-1">{showAnnual ? "T_24" : "Venta 2024"}</p><p className="text-2xl font-bold">{formatCurrency(showAnnual ? totals.t_24 : totals.t24)}</p></div>
                   <div><p className="text-xs font-bold text-blue-400 uppercase mb-1">{showAnnual ? "T_25" : "Venta 2025"}</p><p className="text-2xl font-bold">{formatCurrency(showAnnual ? totals.t_25 : totals.t25)}</p></div>
                   <div><p className="text-xs font-bold text-emerald-400 uppercase mb-1">Venta 2026</p><div className="flex items-end gap-2"><p className="text-2xl font-bold">{formatCurrency(totals.t26)}</p><div className="mb-1"><GrowthIndicator v25={showAnnual ? totals.t_24 : totals.t25} v26={showAnnual ? totals.t_25 : totals.t26} lightMode={true} showLabel={true} labelText={showAnnual ? "vs 2024" : "vs 2025"} /></div></div></div>
                   <div><p className="text-xs font-bold text-purple-400 uppercase mb-1">% Mod 25</p><p className="text-xl font-bold">{totals.pctMod25.toFixed(2)}%</p></div>
                   <div><p className="text-xs font-bold text-purple-400 uppercase mb-1">% Mod 26</p><p className="text-xl font-bold">{totals.pctMod26.toFixed(2)}%</p></div>
               </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[400px]">
                   <div className="bg-slate-50 p-4 border-b border-gray-200 flex items-center gap-2 sticky top-0 z-10"><Users className="w-4 h-4 text-slate-500" /><h3 className="font-bold text-slate-700">Ventas por Agente (Ranking 2025)</h3></div>
                   <div className="overflow-y-auto flex-1"><table className="w-full text-sm text-left"><thead className="bg-slate-50 text-slate-500 uppercase text-xs sticky top-0 z-10"><tr><th className="p-3 bg-slate-50">Agente</th><th className="text-right p-3 bg-slate-50">{showAnnual ? "T_24" : "2024"}</th><th className="text-right p-3 bg-slate-50">{showAnnual ? "T_25" : "2025"}</th><th className="text-right p-3 bg-slate-50">2026</th><th className="text-right p-3 bg-slate-50">{showAnnual ? "Dif 25/24" : "Dif 26/25"}</th></tr></thead><tbody className="divide-y divide-gray-100">{agents.map((a, i) => (<tr key={i} className="hover:bg-slate-50"><td className="p-3 font-medium truncate max-w-[120px] md:max-w-[200px]" title={safeString(a.name)}>{safeString(a.name)}</td><td className="p-3 text-right text-gray-500">{formatCurrency(showAnnual ? a.t_24 : a.v24)}</td><td className="p-3 text-right font-bold text-gray-700">{formatCurrency(showAnnual ? a.t_25 : a.v25)}</td><td className="p-3 text-right text-gray-500">{formatCurrency(a.v26)}</td><td className="p-3 text-right"><GrowthIndicator v25={showAnnual ? a.t_24 : a.v25} v26={showAnnual ? a.t_25 : a.v26} /></td></tr>))}</tbody></table></div>
               </div>
               <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[400px]">
                   <div className="bg-slate-50 p-4 border-b border-gray-200 flex items-center gap-2 sticky top-0 z-10"><MapPin className="w-4 h-4 text-slate-500" /><h3 className="font-bold text-slate-700">Ventas por Provincia (Ranking 2025)</h3></div>
                   <div className="overflow-y-auto flex-1"><table className="w-full text-sm text-left"><thead className="bg-slate-50 text-slate-500 uppercase text-[10px] sticky top-0 z-10"><tr><th className="p-3 bg-slate-50">Provincia</th><th className="text-right p-3 bg-slate-50">{showAnnual ? "T_24" : "2024"}</th><th className="text-right p-3 bg-slate-50">{showAnnual ? "T_25" : "2025"}</th><th className="text-right p-3 bg-slate-50">2026</th><th className="text-right p-3 bg-slate-50">{showAnnual ? "Dif 25/24" : "Dif 26/25"}</th><th className="text-center p-3 bg-slate-50">POT</th><th className="text-center p-3 bg-slate-50">RY</th></tr></thead><tbody className="divide-y divide-gray-100">{provinces.map((p, i) => (<tr key={i} className="hover:bg-slate-50"><td className="p-3 font-medium">{safeString(p.name)}</td><td className="p-3 text-right text-gray-500">{formatCurrency(showAnnual ? p.t_24 : p.v24)}</td><td className="p-3 text-right font-bold text-gray-700">{formatCurrency(showAnnual ? p.t_25 : p.v25)}</td><td className="p-3 text-right text-gray-500">{formatCurrency(p.v26)}</td><td className="p-3 text-right"><GrowthIndicator v25={showAnnual ? p.t_24 : p.v25} v26={showAnnual ? p.t_25 : p.v26} /></td><td className="p-3 text-center text-gray-500 text-xs font-mono">{formatPercentage(p.m_pot)}</td><td className={`p-3 text-center text-xs font-mono font-bold ${getMerskaColorClass(p.m_pot, p.m_ry)}`}>{formatPercentage(p.m_ry)}</td></tr>))}</tbody></table></div>
               </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                   <div className="bg-slate-50 p-4 border-b border-gray-200 flex items-center gap-2 sticky top-0 z-10"><Award className="w-4 h-4 text-slate-500" /><h3 className="font-bold text-slate-700">Top 10 Clientes (Global 2025)</h3></div>
                   <div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead className="bg-slate-50 text-slate-500 uppercase text-xs"><tr><th className="p-3">Cliente</th><th className="text-right">{showAnnual ? "T_24" : "2024"}</th><th className="text-right">{showAnnual ? "T_25" : "2025"}</th><th className="text-right">2026</th><th className="text-right">{showAnnual ? "Dif 25/24" : "Dif %"}</th></tr></thead><tbody className="divide-y divide-gray-100">{topClients.map((c, i) => (<tr key={i} className="hover:bg-slate-50"><td className="p-3 font-medium truncate max-w-[120px] md:max-w-[200px]" title={safeString(c.CLIENTE)}>{safeString(c.CLIENTE)}</td><td className="p-3 text-right text-gray-500">{formatCurrency(showAnnual ? c.T_24 : c.VTA_2024)}</td><td className="p-3 text-right font-bold text-gray-700">{formatCurrency(showAnnual ? c.T_25 : c.VTA_2025)}</td><td className="p-3 text-right text-gray-500">{formatCurrency(c.VTA_2026)}</td><td className="p-3 text-right"><GrowthIndicator v25={showAnnual ? c.T_24 : c.VTA_2025} v26={showAnnual ? c.T_25 : c.VTA_2026} /></td></tr>))}</tbody></table></div>
               </div>
               <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                   <div className="bg-slate-50 p-4 border-b border-gray-200 flex items-center gap-2 sticky top-0 z-10"><Package className="w-4 h-4 text-slate-500" /><h3 className="font-bold text-slate-700">Top 10 Series (Global 2025)</h3></div>
                   <div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead className="bg-slate-50 text-slate-500 uppercase text-xs"><tr><th className="p-3">Serie</th><th className="text-right">2024</th><th className="text-right">2025</th><th className="text-right">2026</th><th className="text-right">Dif %</th></tr></thead><tbody className="divide-y divide-gray-100">{topSeries.map((s, i) => (<tr key={i} className="hover:bg-slate-50"><td className="p-3 font-medium">{safeString(s.SERIE)}</td><td className="p-3 text-right text-gray-500">{formatCurrency(s.v24)}</td><td className="p-3 text-right font-bold text-gray-700">{formatCurrency(s.v25)}</td><td className="p-3 text-right text-gray-500">{formatCurrency(s.v26)}</td><td className="p-3 text-right"><GrowthIndicator v25={s.v25} v26={s.v26} /></td></tr>))}</tbody></table></div>
               </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
               <div className="bg-purple-50 p-4 border-b border-purple-100 flex items-center gap-2 sticky top-0 z-10"><Store className="w-4 h-4 text-purple-600" /><h3 className="font-bold text-purple-900">Ranking de Presencia en Exposición</h3></div>
               <div className="p-6"><div className="space-y-3">{exposureCounts.map((item, idx) => { const max = exposureCounts[0]?.count || 1; const widthPct = (item.count / max) * 100; const sharePct = totalExposures > 0 ? ((item.count / totalExposures) * 100).toFixed(1) : "0.0"; return (<div key={idx} className="flex items-center gap-3"><div className="w-24 text-sm font-medium text-gray-600 text-right truncate" title={item.name}>{item.name}</div><div className="flex-1 h-8 bg-gray-50 rounded-full overflow-hidden relative border border-gray-100"><div className="h-full bg-purple-500/80 rounded-full flex items-center justify-end px-2 transition-all duration-500" style={{ width: `${Math.max(widthPct, 2)}%` }}></div></div><div className="w-16 text-sm font-bold text-gray-800 text-right flex flex-col leading-none justify-center"><span>{item.count}</span><span className="text-[10px] text-gray-400 font-medium">{sharePct}%</span></div></div>); })}</div></div>
            </div>
        </div>
    );
};

const SingleClientView = ({ customers, seriesData, promosData, offersData, manualQuotes, incidentsData }) => {
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => { 
        function handleClickOutside(event) { 
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false); 
            }
        } 
        document.addEventListener("mousedown", handleClickOutside); 
        return () => document.removeEventListener("mousedown", handleClickOutside); 
    }, [wrapperRef]);

    const filteredOptions = useMemo(() => { if (!customers) return []; return customers.filter(c => (c.CLIENTE && safeString(c.CLIENTE).toLowerCase().includes(search.toLowerCase())) || (c.N_CLIENTE && safeString(c.N_CLIENTE).toLowerCase().includes(search.toLowerCase()))).slice(0, 50); }, [customers, search]);
    const handleSelect = (c) => { setSelectedCustomer(c); setSearch(safeString(c.CLIENTE)); setIsOpen(false); };
    const customerTopSeries = useMemo(() => { if (!selectedCustomer) return []; return seriesData.filter(s => s.CLIENTE === selectedCustomer.CLIENTE).sort((a, b) => b.VTA_2025 - a.VTA_2025).slice(0, 5); }, [selectedCustomer, seriesData]);
    
    // --- LÓGICA DE OFERTAS ---
    const clientOffers = useMemo(() => {
        if (!selectedCustomer) return [];
        
        // 1. Ofertas del Excel (Estáticas)
        const staticOffers = offersData.filter(o => o.CLIENTE === selectedCustomer.CLIENTE).map((o, idx) => ({
            id: `static-${idx}`,
            year: o.ANO,
            approved: o.APROBADO,
            model: o.MODELO,
            units: o.UNIDADES,
            additional: o.ADICIONAL,
            type: 'Excel'
        }));

        // 2. Cotizaciones Manuales (App)
        const appQuotes = Object.values(manualQuotes || {})
            .filter(q => q.nClient === selectedCustomer.N_CLIENTE)
            .map(q => ({
                id: q.id || Math.random(),
                year: q.year || q.date.substring(0, 4),
                approved: q.approved || "Pen",
                model: q.model,
                units: q.units,
                additional: q.additional,
                type: 'App',
                date: q.date
            }));

        // Combinar y ordenar por año descendente
        return [...appQuotes, ...staticOffers].sort((a, b) => b.year - a.year);
    }, [selectedCustomer, offersData, manualQuotes]);

    // --- LÓGICA DE INCIDENCIAS ---
    const clientIncidents = useMemo(() => {
        if (!selectedCustomer || !incidentsData) return [];
        return incidentsData.filter(i => i.CLIENTE === selectedCustomer.CLIENTE).sort((a, b) => b.ANO - a.ANO);
    }, [selectedCustomer, incidentsData]);

    return (
        <div className="space-y-6">
            <div className="relative w-full max-w-xl mx-auto" ref={wrapperRef}><label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Buscar Cliente</label><div className="relative flex items-center bg-white border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 cursor-text" onClick={() => setIsOpen(true)}><Search className="w-5 h-5 text-gray-400 ml-3" /><input type="text" className="w-full py-2.5 px-3 outline-none text-gray-700 bg-transparent placeholder-gray-400" placeholder="Nombre o código..." value={search} onChange={(e) => { setSearch(e.target.value); setIsOpen(true); if(e.target.value === "") setSelectedCustomer(null); }} onFocus={() => setIsOpen(true)} />{selectedCustomer ? (<button onClick={(e) => {e.stopPropagation(); setSelectedCustomer(null); setSearch(""); setIsOpen(true);}} className="p-2 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>) : (<div className="p-2 text-gray-400"><ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} /></div>)}</div>{isOpen && (<div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-y-auto">{filteredOptions.length > 0 ? (filteredOptions.map((c, i) => (<div key={i} className={`p-3 cursor-pointer flex justify-between items-center border-b last:border-0 hover:bg-blue-50 transition-colors ${selectedCustomer && selectedCustomer.N_CLIENTE === c.N_CLIENTE ? 'bg-blue-50' : ''}`} onClick={() => handleSelect(c)}><div className="flex flex-col"><span className="font-medium text-gray-800">{safeString(c.CLIENTE)}</span><span className="text-xs text-gray-500">{safeString(c.CIUDAD)} ({safeString(c.PROVINCIA)})</span></div><span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-mono">{safeString(c.N_CLIENTE)}</span></div>))) : (<div className="p-4 text-center text-gray-500 text-sm">No se encontraron clientes</div>)}</div>)}</div>
            {selectedCustomer ? (
                <div className="animate-fade-in-up space-y-6">
                    <AutomaticReportModal isOpen={showReport} onClose={() => setShowReport(false)} data={selectedCustomer} type="CLIENT" contextName={selectedCustomer.CLIENTE} />
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"><div className="flex items-center gap-3"><div className="bg-blue-600 p-3 rounded-xl text-white shadow-lg shadow-blue-200"><User className="w-6 h-6" /></div><div><h2 className="text-2xl font-bold text-gray-900">{safeString(selectedCustomer.CLIENTE)}</h2><div className="flex items-center gap-2 text-sm text-gray-500 mt-1"><span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-mono">ID: {safeString(selectedCustomer.N_CLIENTE)}</span><span>•</span><span>Pagador: {safeString(selectedCustomer.PAGADOR)}</span></div></div></div><div className="flex gap-2"><button onClick={() => setShowReport(true)} className="flex items-center gap-2 bg-gradient-to-r from-blue-700 to-indigo-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all font-bold text-xs"><Lightbulb className="w-4 h-4 text-yellow-300" /> Informe IA</button><span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center ${selectedCustomer.RC === 'NO' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>RC: {safeString(selectedCustomer.RC)}</span>{selectedCustomer.GRUPO && (<span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center">GRUPO: {safeString(selectedCustomer.GRUPO)}</span>)}</div></div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-8 space-y-6">
                             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200"><SectionHeader title="Información General" /><div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4"><div><span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Ubicación</span><div className="flex items-start gap-2"><MapPin className="w-4 h-4 text-gray-400 mt-0.5" /><div><p className="font-medium text-gray-900">{safeString(selectedCustomer.CIUDAD)}</p><p className="text-xs text-gray-500">{safeString(selectedCustomer.PROVINCIA)}</p></div></div></div><div><span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Equipo</span><div className="flex items-start gap-2"><Users className="w-4 h-4 text-gray-400 mt-0.5" /><div><p className="font-medium text-gray-900">{safeString(selectedCustomer.COMERCIAL)}</p>{selectedCustomer.SUBAGENTE && <p className="text-xs text-gray-500">Sub: {safeString(selectedCustomer.SUBAGENTE)}</p>}</div></div></div><div><span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Contacto</span><div className="flex items-start gap-2"><User className="w-4 h-4 text-gray-400 mt-0.5" /><p className="font-medium text-gray-900">{safeString(selectedCustomer.COMPRADOR) || "-"}</p></div></div></div></div>
                             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200"><SectionHeader title="Condiciones Comerciales" /><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><InfoCard icon={Percent} label="Descuentos" value={selectedCustomer.DESCUENTOS} highlight /><InfoCard icon={Calendar} label="Forma Pago" value={selectedCustomer.PAGO} /><InfoCard label="Promociones" value={selectedCustomer.PROMOCIONES || "Sin promociones"} /></div></div>
                             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200"><SectionHeader title="Series Exposición" /><div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl border border-purple-100"><div className="bg-white p-3 rounded-full border border-purple-100 shadow-sm shrink-0"><Briefcase className="w-6 h-6 text-purple-600" /></div><div className="flex-1"><h4 className="text-sm font-bold text-purple-900 uppercase tracking-wide mb-2">Series en Exposición / Estado</h4>{selectedCustomer.EXPO_ROYO && selectedCustomer.EXPO_ROYO !== "No" ? (<div className="flex flex-wrap gap-2">{selectedCustomer.EXPO_ROYO.split(',').map((item, idx) => (<span key={idx} className="px-3 py-1 bg-white border border-purple-200 text-purple-700 rounded-lg text-sm font-medium shadow-sm">{item.trim()}</span>))}</div>) : (<p className="text-gray-500 italic">No hay información de exposiciones registrada.</p>)}</div></div></div>
                             {customerTopSeries.length > 0 ? (<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200"><SectionHeader title="Top 5 Series Más Vendidas" /><CompactBarChart data={customerTopSeries} /></div>) : (<div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-300 text-center text-gray-400 text-sm">No hay datos de ventas registrados.</div>)}
                             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mt-6 border-l-4 border-l-red-400"><h3 className="text-sm font-bold text-red-800 uppercase tracking-widest mb-4 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Incidencias</h3><div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead className="bg-red-50 text-red-900 uppercase text-xs"><tr><th className="p-3 w-16">Año</th><th className="p-3">Motivo</th><th className="p-3 text-center w-16">Veces</th><th className="p-3 text-right">Demerito</th><th className="p-3 text-right">Descuento</th></tr></thead><tbody className="divide-y divide-red-100">{clientIncidents.map((inc, idx) => (<tr key={idx} className="hover:bg-red-50/50"><td className="p-3 font-medium text-gray-500">{inc.ANO}</td><td className="p-3 font-medium text-gray-800">{inc.MOTIVO}</td><td className="p-3 text-center font-mono text-gray-600">{inc.VECES > 0 ? inc.VECES : '-'}</td><td className="p-3 text-right font-mono text-red-600">{inc.DEMERITO ? formatPercentage(inc.DEMERITO) : '-'}</td><td className="p-3 text-right font-mono text-green-600">{inc.DESCUENTO ? formatPercentage(inc.DESCUENTO) : '-'}</td></tr>))}{clientIncidents.length === 0 && (<tr><td colSpan="5" className="p-6 text-center text-gray-400 italic">No hay incidencias registradas.</td></tr>)}</tbody></table></div></div>
                             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mt-6"><SectionHeader title="Ofertas / Cotizaciones" /><div className="overflow-x-auto mt-4"><table className="w-full text-sm text-left"><thead className="bg-purple-50 text-purple-900 uppercase text-xs"><tr><th className="p-3">Año</th><th className="p-3">Modelo / Serie</th><th className="p-3 text-center">Unidades</th><th className="p-3 text-center">Adicional</th><th className="p-3 text-center">Estado</th></tr></thead><tbody className="divide-y divide-gray-100">{clientOffers.map((o, idx) => (<tr key={idx} className="hover:bg-gray-50"><td className="p-3 font-medium text-gray-500">{o.year}</td><td className="p-3 font-bold text-gray-800">{o.model}</td><td className="p-3 text-center font-mono">{o.units}</td><td className="p-3 text-center text-green-600 font-bold">{o.additional}</td><td className="p-3 text-center"><span className={`px-2 py-1 rounded text-xs font-bold border ${o.approved === 'Si' ? 'bg-green-100 text-green-700 border-green-200' : o.approved === 'No' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>{o.approved}</span></td></tr>))}{clientOffers.length === 0 && (<tr><td colSpan="5" className="p-6 text-center text-gray-400 italic">No hay ofertas registradas.</td></tr>)}</tbody></table></div></div>
                        </div>
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 border-l-4 border-l-orange-400"><div className="flex justify-between items-start mb-3"><h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm uppercase tracking-wide"><FileText className="w-4 h-4 text-orange-500" /> Nota Última Visita</h3>{selectedCustomer.F_VISITA && (<span className="text-xs text-orange-700 bg-orange-50 px-2 py-1 rounded font-mono border border-orange-100">{formatDate(selectedCustomer.F_VISITA)}</span>)}</div><p className="text-sm text-gray-600 italic leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">"{safeString(selectedCustomer.NOTA_VISITA) || "Sin notas registradas"}"</p></div>
                            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl overflow-hidden relative">
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
                                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2 relative z-10"><TrendingUp className="w-4 h-4" /> Rendimiento Global</h3>
                                <div className="space-y-6 relative z-10">
                                    <div className="grid grid-cols-2 gap-4 border-b border-white/10 pb-4">
                                        <div><p className="text-slate-400 text-xs mb-1 uppercase">T_24</p><p className="text-xl font-bold text-slate-300">{formatCurrency(selectedCustomer.T_24)}</p></div>
                                        <div className="text-right">
                                            <p className="text-slate-400 text-xs mb-1 uppercase">T_25</p>
                                            <div className="flex flex-col items-end gap-1">
                                                <p className="text-xl font-bold text-white">{formatCurrency(selectedCustomer.T_25)}</p>
                                                <GrowthIndicator v25={selectedCustomer.T_24} v26={selectedCustomer.T_25} lightMode={true} showLabel={true} labelText="vs 24" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-end border-b border-white/10 pb-4">
                                        <div><p className="text-slate-400 text-xs mb-1 uppercase">YTD 2025</p><p className="text-xl font-bold text-slate-200">{formatCurrency(selectedCustomer.VTA_2025)}</p></div>
                                        <div className="text-right">
                                            <p className="text-slate-400 text-xs mb-1 uppercase">MOD % 25</p>
                                            <p className="text-lg font-mono text-slate-200">
                                                {(selectedCustomer.T_25 || selectedCustomer.VTA_2025) > 0 ? (((selectedCustomer.MOD_25 || 0) / (selectedCustomer.T_25 || selectedCustomer.VTA_2025)) * 100).toFixed(2) + '%' : '-'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-white/10 p-5 rounded-xl border border-white/10 backdrop-blur-sm">
                                        <div className="flex justify-between items-center mb-1"><p className="text-blue-300 text-xs font-bold uppercase tracking-wider">Total 2026</p><span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded">Actual</span></div>
                                        <div className="flex items-end justify-between"><p className="text-4xl font-bold text-white tracking-tight">{formatCurrency(selectedCustomer.VTA_2026)}</p><div className="mb-1"><GrowthIndicator v25={selectedCustomer.VTA_2025} v26={selectedCustomer.VTA_2026} lightMode={true} showLabel={true} /></div></div>
                                        <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-4">
                                            <div><span className="text-xs text-slate-400 block">Previsión 26</span><span className="font-mono text-sm">{formatCurrency(selectedCustomer.PRE_26)}</span></div>
                                            <div className="text-right"><span className="text-xs text-green-400 block">MOD % 26</span><span className="font-mono text-sm font-bold text-green-300">{selectedCustomer.VTA_2026 > 0 ? ((selectedCustomer.MOD_26 || 0) / selectedCustomer.VTA_2026 * 100).toFixed(2) + '%' : '-'}</span></div>
                                        </div>
                                    </div>
                                    <div className="bg-indigo-900/50 p-4 rounded-xl border border-indigo-500/30 flex items-center justify-between">
                                        <div><p className="text-indigo-300 text-xs font-bold uppercase">Serie Tuyo 25 / 26</p><div className="flex gap-4"><p className="text-lg font-bold text-indigo-200 opacity-70">{formatCurrency(selectedCustomer.TUYO_25)}</p><p className="text-2xl font-bold mt-0.5">{formatCurrency(selectedCustomer.TUYO_26)}</p></div></div><Star className="w-8 h-8 text-indigo-400 opacity-60" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (<div className="flex flex-col items-center justify-center py-20 text-gray-400 border-2 border-dashed border-gray-200 rounded-3xl bg-white m-4"><div className="bg-gray-50 p-6 rounded-full mb-4"><Search className="w-12 h-12 text-gray-300" /></div><p className="text-lg font-medium text-gray-600">Busca un cliente para ver su ficha</p></div>)}
        </div>
    );
};

const AgentView = ({ data, seriesData, promosData, merskaData }) => {
  const [selectedAgent, setSelectedAgent] = useState("");
  const [showReport, setShowReport] = useState(false);
  const [showAnnual, setShowAnnual] = useState(false);

  const agents = useMemo(() => [...new Set(data.map(i => i.COMERCIAL))].filter(Boolean).sort(), [data]);
  const { provinceStats, topClients, agentTotals, topSeries, filteredData } = useMemo(() => { 
      if (!selectedAgent) return { provinceStats: [], topClients: [], agentTotals: {}, topSeries: [], filteredData: [] }; 
      const filtered = data.filter(i => i.COMERCIAL === selectedAgent); 
      const clientNames = filtered.map(c => c.CLIENTE); 
      const agentTotals = filtered.reduce((acc, curr) => { 
          acc.v24 += curr.VTA_2024; 
          acc.v25 += curr.VTA_2025; 
          acc.v26 += curr.VTA_2026; 
          acc.t_24 += (curr.T_24 || 0);
          acc.t_25 += (curr.T_25 || 0);
          acc.mod25 += (curr.MOD_25 || 0); 
          acc.mod26 += (curr.MOD_26 || 0); 
          acc.tuyo26 += curr.TUYO_26; 
          acc.tuyo25 += curr.TUYO_25 || 0; 
          return acc; 
      }, { v24: 0, v25: 0, v26: 0, t_24: 0, t_25: 0, mod25: 0, mod26: 0, tuyo26: 0, tuyo25: 0 }); 
      
      const agentSeries = seriesData.filter(s => clientNames.includes(s.CLIENTE)); 
      
      const t_25_denom = agentTotals.t_25 > 0 ? agentTotals.t_25 : agentTotals.v25;
      const pctMod25 = t_25_denom > 0 ? (agentTotals.mod25 / t_25_denom) * 100 : 0; 
      const pctMod26 = agentTotals.v26 > 0 ? (agentTotals.mod26 / agentTotals.v26) * 100 : 0; 
      agentTotals.pctMod25Str = pctMod25.toFixed(2) + '%'; 
      agentTotals.pctMod26Str = pctMod26.toFixed(2) + '%'; 
      
      const provinces = {}; 
      filtered.forEach(curr => { 
          const prov = safeString(curr.PROVINCIA) || "Sin Provincia"; 
          if (!provinces[prov]) {
              const mInfo = (merskaData || []).find(m => safeString(m.PROVINCIA).toUpperCase() === prov.toUpperCase()) || {};
              provinces[prov] = { name: prov, v24: 0, v25: 0, v26: 0, t_24: 0, t_25: 0, m_pot: mInfo.M_POT, m_ry: mInfo.M_RY };
          }
          provinces[prov].v24 += curr.VTA_2024; 
          provinces[prov].v25 += curr.VTA_2025; 
          provinces[prov].v26 += curr.VTA_2026; 
          provinces[prov].t_24 += (curr.T_24 || 0);
          provinces[prov].t_25 += (curr.T_25 || 0);
      }); 
      
      const top = [...filtered].sort((a, b) => (b.T_25 || 0) - (a.T_25 || 0)).slice(0, 10); 
      const seriesGrouped = {}; 
      agentSeries.forEach(s => { 
          if (!seriesGrouped[s.SERIE]) seriesGrouped[s.SERIE] = { SERIE: s.SERIE, VTA_2024: 0, VTA_2025: 0, VTA_2026: 0 }; 
          seriesGrouped[s.SERIE].VTA_2024 += s.VTA_2024; 
          seriesGrouped[s.SERIE].VTA_2025 += s.VTA_2025; 
          seriesGrouped[s.SERIE].VTA_2026 += s.VTA_2026; 
      }); 
      const topSeries = Object.values(seriesGrouped).sort((a, b) => b.VTA_2025 - a.VTA_2025).slice(0, 10); 
      return { provinceStats: Object.values(provinces), topClients: top, agentTotals, topSeries, filteredData: filtered }; 
  }, [data, selectedAgent, seriesData]);

  const agentPromos = useMemo(() => { if (!selectedAgent || !promosData) return []; const selectedAgentNorm = safeString(selectedAgent).trim().toUpperCase(); return promosData.filter(p => safeString(p.COMERCIAL).trim().toUpperCase() === selectedAgentNorm && (String(p.ANO) === "2025" || String(p.ANO) === "2026")).sort((a,b) => b.ANO - a.ANO); }, [selectedAgent, promosData]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Users className="w-5 h-5 text-blue-600" /> Análisis por Agente</h2>
              {selectedAgent && (
                  <button onClick={() => setShowAnnual(!showAnnual)} className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors shadow-sm ${showAnnual ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                      {showAnnual ? 'Cierre Anual' : 'Ver YTD'}
                  </button>
              )}
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
              <select className="w-full max-w-md p-3 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)}><option value="">-- Seleccionar Agente --</option>{agents.map(a => <option key={a} value={a}>{a}</option>)}</select>
              {selectedAgent && (<button onClick={() => setShowReport(true)} className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-700 to-indigo-700 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all font-bold text-sm shrink-0"><Lightbulb className="w-4 h-4 text-yellow-300" /> Informe IA</button>)}
          </div>
      </div>
      {selectedAgent && (
        <div className="space-y-6 animate-fade-in-up">
           <AutomaticReportModal isOpen={showReport} onClose={() => setShowReport(false)} data={filteredData} type="AGENT" contextName={selectedAgent} />
           <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
               <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm"><p className="text-xs font-bold text-gray-400 uppercase">{showAnnual ? "T_24" : "Venta 2024"}</p><p className="text-lg font-bold text-gray-700">{formatCurrency(showAnnual ? agentTotals.t_24 : agentTotals.v24)}</p></div>
               <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 shadow-sm"><p className="text-xs font-bold text-blue-600 uppercase">{showAnnual ? "T_25" : "Venta 2025"}</p><p className="text-lg font-bold text-blue-800">{formatCurrency(showAnnual ? agentTotals.t_25 : agentTotals.v25)}</p></div>
               <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm"><p className="text-xs font-bold text-gray-400 uppercase">Venta 2026</p><div className="flex items-center justify-between"><p className="text-lg font-bold text-gray-700">{formatCurrency(agentTotals.v26)}</p><GrowthIndicator v25={showAnnual ? agentTotals.t_24 : agentTotals.v25} v26={showAnnual ? agentTotals.t_25 : agentTotals.v26} showLabel={true} labelText={showAnnual ? "vs 2024" : "vs 2025"} /></div></div>
               <div className="bg-green-50 p-4 rounded-xl border border-green-200 shadow-sm"><p className="text-xs font-bold text-green-600 uppercase">% Modular 25/26</p><p className="text-sm font-bold text-green-800">{agentTotals.pctMod25Str} / {agentTotals.pctMod26Str}</p></div>
               <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200 shadow-sm"><p className="text-xs font-bold text-indigo-600 uppercase">Tuyo 25/26</p><p className="text-sm font-bold text-indigo-800 truncate">{formatCurrency(agentTotals.tuyo25)} / {formatCurrency(agentTotals.tuyo26)}</p></div>
          </div>
           <div className="grid grid-cols-1 gap-6">
               <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-fit"><div className="bg-blue-50 p-4 border-b border-blue-100 font-bold text-blue-800 flex items-center gap-2"><MapPin className="w-4 h-4" /> Ventas Totales por Provincia</div><div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead className="bg-gray-50 text-gray-500 uppercase text-[10px]"><tr><th className="p-3">Provincia</th><th className="p-3 text-right">{showAnnual ? "T_24" : "2024"}</th><th className="p-3 text-right">{showAnnual ? "T_25" : "2025"}</th><th className="p-3 text-right">2026</th><th className="p-3 text-right">{showAnnual ? "Dif 25/24" : "Dif 26/25"}</th><th className="p-3 text-center">POT</th><th className="p-3 text-center">RY</th></tr></thead><tbody className="divide-y divide-gray-100">{provinceStats.map((p, i) => (<tr key={i} className="hover:bg-gray-50"><td className="p-3 font-medium">{safeString(p.name)}</td><td className="p-3 text-right font-mono text-gray-500">{formatCurrency(showAnnual ? p.t_24 : p.v24)}</td><td className="p-3 text-right font-mono font-bold text-gray-900">{formatCurrency(showAnnual ? p.t_25 : p.v25)}</td><td className="p-3 text-right font-mono text-blue-600">{formatCurrency(p.v26)}</td><td className="p-3 text-right"><GrowthIndicator v25={showAnnual ? p.t_24 : p.v25} v26={showAnnual ? p.t_25 : p.v26} /></td><td className="p-3 text-center text-gray-500 text-xs font-mono">{formatPercentage(p.m_pot)}</td><td className={`p-3 text-center text-xs font-mono font-bold ${getMerskaColorClass(p.m_pot, p.m_ry)}`}>{formatPercentage(p.m_ry)}</td></tr>))}</tbody></table></div></div>
               <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"><div className="bg-orange-50 p-4 border-b border-orange-100 font-bold text-orange-800 flex items-center gap-2"><Award className="w-4 h-4" /> Top 10 Clientes (Ranking 2025)</div><div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead className="bg-gray-50 text-gray-500 uppercase text-xs"><tr><th className="p-3 w-8">#</th><th className="p-3">Cliente</th><th className="p-3 text-right">{showAnnual ? "T_24" : "Venta 2024"}</th><th className="p-3 text-right">{showAnnual ? "T_25" : "Venta 2025"}</th><th className="p-3 text-right">Venta 2026</th> <th className="p-3 text-right">{showAnnual ? "Dif 25/24" : "Dif %"}</th></tr></thead><tbody className="divide-y divide-gray-100">{topClients.map((c, i) => (<tr key={i} className="hover:bg-gray-50"><td className="p-3 text-center text-gray-400 text-xs">{i+1}</td><td className="p-3 font-medium truncate max-w-[200px]" title={safeString(c.CLIENTE)}>{safeString(c.CLIENTE)}</td><td className="p-3 text-right font-mono text-gray-500">{formatCurrency(showAnnual ? c.T_24 : c.VTA_2024)}</td><td className="p-3 text-right font-mono font-bold text-gray-900 bg-orange-50/50">{formatCurrency(showAnnual ? c.T_25 : c.VTA_2025)}</td><td className="p-3 text-right font-mono text-gray-500">{formatCurrency(c.VTA_2026)}</td> <td className="p-3 text-right"><GrowthIndicator v25={showAnnual ? c.T_24 : c.VTA_2025} v26={showAnnual ? c.T_25 : c.VTA_2026} /></td></tr>))}</tbody></table></div></div>
          </div>
           <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"><div className="bg-purple-50 p-4 border-b border-purple-100 font-bold text-purple-800 flex items-center gap-2"><Package className="w-4 h-4" /> Top 10 Series Más Vendidas por {selectedAgent}</div><div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead className="bg-gray-50 text-gray-500 uppercase text-xs"><tr><th className="p-3">Serie</th><th className="text-right p-3">2024</th><th className="text-right p-3">2025</th><th className="text-right p-3">2026</th><th className="text-right p-3">Dif %</th></tr></thead><tbody className="divide-y divide-gray-100">{topSeries.map((s, i) => (<tr key={i} className="hover:bg-gray-50"><td className="p-3 font-medium flex items-center gap-2"><span className="text-xs font-mono text-gray-400 w-4">{i+1}</span>{safeString(s.SERIE)}</td><td className="p-3 text-right text-gray-500 font-mono">{formatCurrency(s.VTA_2024)}</td><td className="p-3 text-right font-bold text-purple-700 font-mono bg-purple-50/30">{formatCurrency(s.VTA_2025)}</td><td className="p-3 text-right text-gray-500 font-mono">{formatCurrency(s.VTA_2026)}</td><td className="p-3 text-right"><GrowthIndicator v25={s.VTA_2025} v26={s.VTA_2026} /></td></tr>))}</tbody></table></div></div>
        </div>
      )}
    </div>
  );
};

const ProvinceView = ({ data, merskaData }) => {
  const [selectedProv, setSelectedProv] = useState("");
  const [showReport, setShowReport] = useState(false);
  const [showAnnual, setShowAnnual] = useState(false);

  const provinces = useMemo(() => [...new Set(data.map(i => i.PROVINCIA))].filter(Boolean).sort(), [data]);
  
  const currentMerska = useMemo(() => {
      if (!selectedProv || !merskaData) return null;
      return merskaData.find(m => safeString(m.PROVINCIA).toUpperCase() === safeString(selectedProv).toUpperCase());
  }, [selectedProv, merskaData]);

  const { topClients, totals, agentsInProvince, filteredData } = useMemo(() => { 
      if (!selectedProv) return { topClients: [], totals: { v24: 0, v25: 0, v26: 0, t_24: 0, t_25: 0 }, agentsInProvince: [], filteredData: [] }; 
      const filtered = data.filter(i => i.PROVINCIA === selectedProv); 
      const totals = filtered.reduce((acc, curr) => ({ 
          v24: acc.v24 + curr.VTA_2024, 
          v25: acc.v25 + curr.VTA_2025, 
          v26: acc.v26 + curr.VTA_2026,
          t_24: acc.t_24 + (curr.T_24 || 0),
          t_25: acc.t_25 + (curr.T_25 || 0)
      }), { v24: 0, v25: 0, v26: 0, t_24: 0, t_25: 0 }); 
      
      const agentGroups = {}; 
      filtered.forEach(c => { 
          const ag = safeString(c.COMERCIAL) || "Sin Asignar"; 
          if(!agentGroups[ag]) agentGroups[ag] = { name: ag, v24: 0, v25: 0, v26: 0, t_24: 0, t_25: 0 }; 
          agentGroups[ag].v24 += c.VTA_2024; 
          agentGroups[ag].v25 += c.VTA_2025; 
          agentGroups[ag].v26 += c.VTA_2026; 
          agentGroups[ag].t_24 += (c.T_24 || 0);
          agentGroups[ag].t_25 += (c.T_25 || 0);
      }); 
      const agentsInProvince = Object.values(agentGroups); 
      const top = filtered.sort((a, b) => (b.T_25 || 0) - (a.T_25 || 0)).slice(0, 10); 
      return { topClients: top, totals, agentsInProvince, filteredData: filtered }; 
  }, [data, selectedProv]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2"><MapPin className="w-5 h-5 text-green-600" /> Análisis por Provincia</h2>
              {selectedProv && (
                  <button onClick={() => setShowAnnual(!showAnnual)} className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors shadow-sm ${showAnnual ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                      {showAnnual ? 'Cierre Anual' : 'Ver YTD'}
                  </button>
              )}
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
              <select className="w-full max-w-md p-3 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500" value={selectedProv} onChange={(e) => setSelectedProv(e.target.value)}><option value="">-- Seleccionar Provincia --</option>{provinces.map(p => <option key={p} value={p}>{p}</option>)}</select>
              {selectedProv && (<button onClick={() => setShowReport(true)} className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-700 to-indigo-700 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all font-bold text-sm shrink-0"><Lightbulb className="w-4 h-4 text-yellow-300" /> Informe IA</button>)}
          </div>
      </div>
      {selectedProv && (
        <div className="space-y-6 animate-fade-in-up">
           <AutomaticReportModal isOpen={showReport} onClose={() => setShowReport(false)} data={filteredData} type="PROVINCE" contextName={selectedProv} />
           
           {currentMerska && (
               <div className="grid grid-cols-3 gap-4 mb-2">
                   <div className="bg-purple-50 p-3 rounded-xl text-center border border-purple-100"><div className="text-[10px] font-bold text-purple-600 uppercase">Índice M_POT</div><div className="text-lg font-bold text-purple-900 font-mono">{formatPercentage(currentMerska.M_POT)}</div></div>
                   <div className={`p-3 rounded-xl text-center border ${getMerskaColorClass(currentMerska.M_POT, currentMerska.M_RY)}`}><div className="text-[10px] font-bold uppercase opacity-80">Índice M_RY</div><div className="text-lg font-bold font-mono">{formatPercentage(currentMerska.M_RY)}</div></div>
                   <div className="bg-purple-50 p-3 rounded-xl text-center border border-purple-100"><div className="text-[10px] font-bold text-purple-600 uppercase">Índice M_OB</div><div className="text-lg font-bold text-purple-900 font-mono">{formatPercentage(currentMerska.M_OB)}</div></div>
               </div>
           )}

           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               <div className="bg-slate-100 p-4 rounded-xl text-center"><div className="text-xs font-bold text-slate-500 uppercase">{showAnnual ? "T_24" : "2024"}</div><div className="text-xl font-bold text-slate-700">{formatCurrency(showAnnual ? totals.t_24 : totals.v24)}</div></div>
               <div className="bg-green-100 p-4 rounded-xl text-center border border-green-200"><div className="text-xs font-bold text-green-600 uppercase">{showAnnual ? "T_25" : "2025"}</div><div className="text-xl font-bold text-green-800">{formatCurrency(showAnnual ? totals.t_25 : totals.v25)}</div></div>
               <div className="bg-slate-100 p-4 rounded-xl text-center border border-slate-200"><div className="text-xs font-bold text-slate-500 uppercase">2026</div><div className="flex justify-center items-center gap-3"><span className="text-xl font-bold text-slate-700">{formatCurrency(totals.v26)}</span><GrowthIndicator v25={showAnnual ? totals.t_24 : totals.v25} v26={showAnnual ? totals.t_25 : totals.v26} showLabel={true} labelText={showAnnual ? "vs 2024" : "vs 2025"} /></div></div>
          </div>

          <div className="grid grid-cols-1 gap-6 mt-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-fit">
                  <div className="bg-blue-50 p-4 border-b border-blue-100 font-bold text-blue-800 flex items-center gap-2"><Users className="w-4 h-4" /> Desglose por Agente</div>
                  <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                              <tr><th className="p-3">Agente</th><th className="p-3 text-right">{showAnnual ? "T_24" : "2024"}</th><th className="p-3 text-right">{showAnnual ? "T_25" : "2025"}</th><th className="p-3 text-right">2026</th><th className="p-3 text-right">{showAnnual ? "Dif 25/24" : "Dif 26/25"}</th><th className="p-3 text-center">POT</th><th className="p-3 text-center">RY</th></tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                              {agentsInProvince.map((a, i) => (
                                  <tr key={i} className="hover:bg-gray-50">
                                      <td className="p-3 font-medium text-blue-600">{safeString(a.name)}</td>
                                      <td className="p-3 text-right text-gray-500">{formatCurrency(showAnnual ? a.t_24 : a.v24)}</td>
                                      <td className="p-3 text-right font-bold text-gray-900">{formatCurrency(showAnnual ? a.t_25 : a.v25)}</td>
                                      <td className="p-3 text-right text-gray-600">{formatCurrency(a.v26)}</td>
                                      <td className="p-3 text-right"><GrowthIndicator v25={showAnnual ? a.t_24 : a.v25} v26={showAnnual ? a.t_25 : a.v26} /></td>
                                      <td className="p-3 text-center text-gray-500 text-xs font-mono">{formatPercentage(a.m_pot)}</td>
                                      <td className={`p-3 text-center text-xs font-mono font-bold ${getMerskaColorClass(a.m_pot, a.m_ry)}`}>{formatPercentage(a.m_ry)}</td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-green-50 p-4 border-b border-green-100 font-bold text-green-800 flex items-center gap-2"><Award className="w-4 h-4" /> Top 10 Clientes (Ranking 2025)</div>
                  <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                              <tr><th className="p-3 w-8">#</th><th className="p-3">Cliente</th><th className="p-3 text-right">{showAnnual ? "T_24" : "Venta 2024"}</th><th className="p-3 text-right">{showAnnual ? "T_25" : "Venta 2025"}</th><th className="p-3 text-right">Venta 2026</th><th className="p-3 text-right">{showAnnual ? "Dif 25/24" : "Dif %"}</th></tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                              {topClients.map((c, i) => (
                                  <tr key={i} className="hover:bg-gray-50">
                                      <td className="p-3 text-center text-gray-400 text-xs">{i+1}</td>
                                      <td className="p-3 font-medium truncate max-w-[200px]" title={safeString(c.CLIENTE)}>{safeString(c.CLIENTE)}</td>
                                      <td className="p-3 text-right text-gray-500">{formatCurrency(showAnnual ? c.T_24 : c.VTA_2024)}</td>
                                      <td className="p-3 text-right font-bold text-green-700 bg-green-50/30">{formatCurrency(showAnnual ? c.T_25 : c.VTA_2025)}</td>
                                      <td className="p-3 text-right text-gray-600">{formatCurrency(c.VTA_2026)}</td>
                                      <td className="p-3 text-right"><GrowthIndicator v25={showAnnual ? c.T_24 : c.VTA_2025} v26={showAnnual ? c.T_25 : c.VTA_2026} /></td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>

        </div>
      )}
    </div>
  );
};

const GroupView = ({ data }) => {
    const [selectedGroup, setSelectedGroup] = useState("");
    const [selectedAgent, setSelectedAgent] = useState("");
    const [showAnnual, setShowAnnual] = useState(false);

    const groups = useMemo(() => [...new Set(data.map(i => safeString(i.GRUPO)))].filter(g => g !== "").sort(), [data]);
    const agents = useMemo(() => [...new Set(data.map(i => safeString(i.COMERCIAL)))].filter(a => a !== "").sort(), [data]);

    const { filteredData, totals } = useMemo(() => {
        if (!selectedGroup) return { filteredData: [], totals: { v24:0, v25:0, v26:0, t_24:0, t_25:0 } };
        
        let filtered = data.filter(i => safeString(i.GRUPO) === selectedGroup);
        if (selectedAgent) {
            filtered = filtered.filter(i => safeString(i.COMERCIAL) === selectedAgent);
        }
        
        const totalsObj = filtered.reduce((acc, curr) => ({
            v24: acc.v24 + curr.VTA_2024,
            v25: acc.v25 + curr.VTA_2025,
            v26: acc.v26 + curr.VTA_2026,
            t_24: acc.t_24 + (curr.T_24 || 0),
            t_25: acc.t_25 + (curr.T_25 || 0)
        }), { v24:0, v25:0, v26:0, t_24:0, t_25:0 });

        const sorted = [...filtered].sort((a,b) => (b.T_25 || 0) - (a.T_25 || 0));

        return { filteredData: sorted, totals: totalsObj };
    }, [data, selectedGroup, selectedAgent]);

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Store className="w-5 h-5 text-blue-600" /> Análisis por Grupos</h2>
                    {selectedGroup && (
                        <button onClick={() => setShowAnnual(!showAnnual)} className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors shadow-sm ${showAnnual ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                            {showAnnual ? 'Cierre Anual' : 'Ver YTD'}
                        </button>
                    )}
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <select className="w-full max-w-md p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700" value={selectedGroup} onChange={e => setSelectedGroup(e.target.value)}>
                        <option value="">-- Seleccionar Grupo --</option>
                        {groups.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    <select className="w-full max-w-md p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700" value={selectedAgent} onChange={e => setSelectedAgent(e.target.value)}>
                        <option value="">-- Todos los Agentes (Opcional) --</option>
                        {agents.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                </div>
            </div>

            {selectedGroup && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                <tr>
                                    <th className="p-4 font-bold">Cliente</th>
                                    <th className="p-4 font-bold">Ciudad</th>
                                    <th className="p-4 font-bold">Agente</th>
                                    <th className="p-4 font-bold text-right">{showAnnual ? "Facturación 2024" : "Facturación 2025"}</th>
                                    <th className="p-4 font-bold text-right">{showAnnual ? "Facturación 2025" : "Facturación 2026"}</th>
                                    <th className="p-4 font-bold text-right">Diferencia</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredData.map((c, i) => (
                                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4"><div className="font-bold text-gray-800">{safeString(c.CLIENTE)}</div><div className="text-xs text-gray-400 font-mono">{safeString(c.N_CLIENTE)}</div></td>
                                        <td className="p-4 text-gray-600">{safeString(c.CIUDAD)}</td>
                                        <td className="p-4 text-gray-600">{safeString(c.COMERCIAL)}</td>
                                        <td className="p-4 text-right text-gray-500 font-mono">{formatCurrency(showAnnual ? c.T_24 : c.VTA_2025)}</td>
                                        <td className="p-4 text-right font-bold text-gray-900 font-mono">{formatCurrency(showAnnual ? c.T_25 : c.VTA_2026)}</td>
                                        <td className="p-4 text-right"><GrowthIndicator v25={showAnnual ? c.T_24 : c.VTA_2025} v26={showAnnual ? c.T_25 : c.VTA_2026} /></td>
                                    </tr>
                                ))}
                                {filteredData.length === 0 && (
                                    <tr><td colSpan="6" className="p-8 text-center text-gray-400 italic">No hay clientes para esta selección.</td></tr>
                                )}
                            </tbody>
                            {filteredData.length > 0 && (
                                <tfoot className="bg-blue-50/50 font-bold">
                                    <tr>
                                        <td className="p-4 text-blue-900 text-right" colSpan="3">TOTAL SELECCIÓN</td>
                                        <td className="p-4 text-right text-blue-800 font-mono">{formatCurrency(showAnnual ? totals.t_24 : totals.v25)}</td>
                                        <td className="p-4 text-right text-blue-900 font-mono">{formatCurrency(showAnnual ? totals.t_25 : totals.v26)}</td>
                                        <td className="p-4 text-right"><GrowthIndicator v25={showAnnual ? totals.t_24 : totals.v25} v26={showAnnual ? totals.t_25 : totals.v26} /></td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

const VisitsView = ({ manualVisits, crmData, onDelete }) => {
    const [showFilter, setShowFilter] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const processedVisits = useMemo(() => { let combined = []; if (manualVisits) { Object.entries(manualVisits).forEach(([id, v]) => { combined.push({ id, type: 'APP', client: v.clientName, nClient: v.nClient, dateStr: formatDate(v.date), rawDate: parseDateObj(v.date), note: v.note, promos: v.promotions, expo: v.expo }); }); } if (crmData) { crmData.forEach((c, index) => { if (c.F_VISITA || (c.NOTA_VISITA && c.NOTA_VISITA.length > 3)) { const rDate = parseDateObj(c.F_VISITA); combined.push({ id: `excel-${index}-${c.N_CLIENTE}`, type: 'EXCEL', client: c.CLIENTE, nClient: c.N_CLIENTE, dateStr: c.F_VISITA ? formatDate(c.F_VISITA) : "Sin Fecha", rawDate: rDate, note: c.NOTA_VISITA, promos: c.PROMOCIONES, expo: c.EXPO_ROYO }); } }); } combined.sort((a,b) => (b.rawDate || new Date(0)) - (a.rawDate || new Date(0))); return combined; }, [manualVisits, crmData]);
    const filteredList = useMemo(() => { if (!startDate && !endDate) return processedVisits; const start = startDate ? new Date(startDate) : new Date('2000-01-01'); const end = endDate ? new Date(endDate) : new Date('2100-01-01'); end.setHours(23, 59, 59); return processedVisits.filter(v => v.rawDate && v.rawDate >= start && v.rawDate <= end); }, [processedVisits, startDate, endDate]);
    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200"><div className="flex flex-col md:flex-row justify-between items-center gap-4"><div><h2 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Calendar className="w-5 h-5 text-orange-600" /> Registro de Visitas</h2><p className="text-sm text-gray-500 mt-1">Historial completo ({processedVisits.length} registros totales)</p></div><button onClick={() => setShowFilter(!showFilter)} className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors shadow-sm ${showFilter ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-blue-600 hover:bg-gray-50'}`}>{showFilter ? 'Ocultar Filtros' : 'Filtrar por Fecha'}</button></div>{showFilter && (<div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-wrap gap-4 items-end animate-fade-in-down"><div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Desde</label><input type="date" className="p-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" value={startDate} onChange={e => setStartDate(e.target.value)} /></div><div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hasta</label><input type="date" className="p-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" value={endDate} onChange={e => setEndDate(e.target.value)} /></div>{(startDate || endDate) && <button onClick={() => {setStartDate(""); setEndDate("")}} className="px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors">Limpiar Filtros</button>}</div>)}</div>
            <div className="bg-orange-50 border border-orange-100 rounded-t-xl p-3 flex items-center gap-2"><div className="w-2 h-2 bg-orange-500 rounded-full ml-2"></div><h3 className="text-sm font-bold text-orange-800">Resultados: {filteredList.length} visitas encontradas</h3></div>
            <div className="bg-white rounded-b-2xl shadow-sm border border-gray-200 border-t-0 overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead className="bg-white text-gray-400 uppercase text-[10px] border-b border-gray-100 tracking-wider"><tr><th className="p-4 font-bold">Cliente</th><th className="p-4 font-bold w-32">Fecha</th><th className="p-4 font-bold max-w-md">Nota</th><th className="p-4 font-bold">Series Expo</th><th className="p-4 text-center w-10"></th></tr></thead><tbody className="divide-y divide-gray-5">{filteredList.map((v) => (<tr key={v.id} className="hover:bg-gray-50 transition-colors group"><td className="p-4 align-top"><div className="font-bold text-gray-800 text-sm">{v.client}</div><div className="text-xs text-gray-400 font-mono mt-0.5">{v.nClient}</div>{v.type === 'APP' && <span className="inline-block mt-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[9px] rounded font-bold uppercase tracking-wider">NUEVA</span>}</td><td className="p-4 align-top"><span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 rounded-md font-bold text-xs whitespace-nowrap shadow-sm border border-orange-200">{v.dateStr}</span></td><td className="p-4 align-top"><p className="text-gray-600 italic leading-relaxed text-sm">"{v.note || "Sin notas"}"</p></td><td className="p-4 align-top text-gray-500 text-xs">{v.expo || "-"}</td><td className="p-4 align-top text-center">{v.type === 'APP' && onDelete && (<button onClick={() => onDelete(v.id)} className="text-gray-300 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 opacity-0 group-hover:opacity-100" title="Eliminar registro manual"><Trash className="w-4 h-4" /></button>)}</td></tr>))}{filteredList.length === 0 && (<tr><td colSpan="5" className="p-12 text-center text-gray-400 flex flex-col items-center"><Calendar className="w-8 h-8 text-gray-200 mb-2"/><span>No se encontraron visitas en este periodo.</span></td></tr>)}</tbody></table></div></div>
        </div>
    );
};

// --- COMPONENTES AÑADIDOS ---

const SeriesRankingView = ({ seriesData, data }) => {
    const [selectedSerie, setSelectedSerie] = useState("");
    const [selectedAgent, setSelectedAgent] = useState("");

    const agents = useMemo(() => [...new Set(data.map(i => safeString(i.COMERCIAL)))].filter(Boolean).sort(), [data]);
    const seriesNames = useMemo(() => [...new Set(seriesData.map(s => safeString(s.SERIE)))].filter(Boolean).sort(), [seriesData]);

    const clientToAgent = useMemo(() => {
        const map = {};
        data.forEach(c => { map[c.CLIENTE] = safeString(c.COMERCIAL); });
        return map;
    }, [data]);

    const filteredSeries = useMemo(() => {
        let filtered = seriesData;
        if (selectedAgent) {
            filtered = filtered.filter(s => clientToAgent[s.CLIENTE] === selectedAgent);
        }
        if (selectedSerie) {
            filtered = filtered.filter(s => safeString(s.SERIE) === selectedSerie);
        }
        
        const grouped = {};
        filtered.forEach(s => {
            const name = safeString(s.SERIE);
            if(!grouped[name]) grouped[name] = { SERIE: name, v24:0, v25:0, v26:0 };
            grouped[name].v24 += s.VTA_2024;
            grouped[name].v25 += s.VTA_2025;
            grouped[name].v26 += s.VTA_2026;
        });
        return Object.values(grouped).sort((a,b) => b.v25 - a.v25);
    }, [seriesData, selectedSerie, selectedAgent, clientToAgent]);

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Package className="w-5 h-5 text-indigo-600" /> Ranking de Series</h2>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col sm:flex-row gap-4">
                <select className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-700" value={selectedSerie} onChange={e => setSelectedSerie(e.target.value)}>
                    <option value="">-- Todas las Series --</option>
                    {seriesNames.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-700" value={selectedAgent} onChange={e => setSelectedAgent(e.target.value)}>
                    <option value="">-- Todos los Agentes --</option>
                    {agents.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-indigo-50 text-indigo-900 uppercase text-xs">
                            <tr>
                                <th className="p-4 font-bold w-16 text-center">#</th>
                                <th className="p-4 font-bold">Colección</th>
                                <th className="p-4 font-bold text-right">2024</th>
                                <th className="p-4 font-bold text-right">2025</th>
                                <th className="p-4 font-bold text-right">2026</th>
                                <th className="p-4 font-bold text-right">Crecimiento</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredSeries.map((s, i) => (
                                <tr key={i} className="hover:bg-indigo-50/50 transition-colors">
                                    <td className="p-4 text-center text-gray-400 text-xs font-mono">{i + 1}</td>
                                    <td className="p-4 font-bold text-gray-800">{s.SERIE}</td>
                                    <td className="p-4 text-right text-gray-500">{formatCurrency(s.v24)}</td>
                                    <td className="p-4 text-right font-bold text-indigo-700 bg-indigo-50/30">{formatCurrency(s.v25)}</td>
                                    <td className="p-4 text-right text-gray-600">{formatCurrency(s.v26)}</td>
                                    <td className="p-4 text-right"><GrowthIndicator v25={s.v25} v26={s.v26} /></td>
                                </tr>
                            ))}
                            {filteredSeries.length === 0 && (
                                <tr><td colSpan="6" className="p-8 text-center text-gray-400 italic">No hay datos de series disponibles para estos filtros.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const CustomRankingView = ({ data, mode }) => {
    const isModular = mode === "MODULAR";
    
    const globalStats = useMemo(() => {
        let globalVta24 = 0, globalVta25 = 0, globalVta26 = 0, globalT25 = 0;
        let mod25 = 0, mod26 = 0;
        let tuyo25 = 0, tuyo26 = 0;

        data.forEach(c => {
            globalVta24 += c.VTA_2024;
            globalVta25 += c.VTA_2025;
            globalVta26 += c.VTA_2026;
            globalT25 += (c.T_25 || c.VTA_2025 || 0); 
            mod25 += (c.MOD_25 || 0);
            mod26 += (c.MOD_26 || 0);
            tuyo25 += (c.TUYO_25 || 0);
            tuyo26 += (c.TUYO_26 || 0);
        });

        const t_25_denom = globalT25 > 0 ? globalT25 : globalVta25;
        const pctMod25 = t_25_denom > 0 ? (mod25 / t_25_denom) * 100 : 0;
        const pctMod26 = globalVta26 > 0 ? (mod26 / globalVta26) * 100 : 0;

        return { globalVta24, pctMod25, pctMod26, tuyo25, tuyo26 };
    }, [data]);

    const rankingData = useMemo(() => {
        return data.map(c => {
            let val25 = 0, val26 = 0;
            if (isModular) {
                val25 = c.MOD_25 || 0;
                val26 = c.MOD_26 || 0;
            } else {
                val25 = c.TUYO_25 || 0;
                val26 = c.TUYO_26 || 0;
            }
            return { CLIENTE: c.CLIENTE, N_CLIENTE: c.N_CLIENTE, val25, val26 };
        }).sort((a, b) => b.val25 - a.val25).slice(0, 50); // Top 50
    }, [data, isModular]);

    const Icon = isModular ? Grid : Star;
    const color = isModular ? 'green' : 'indigo';

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Icon className={`w-5 h-5 text-${color}-600`} /> Ranking {isModular ? 'Gama Modular' : 'Serie Tuyo'}</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {isModular ? (
                    <>
                        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                            <p className="text-xs font-bold text-green-700 uppercase mb-1">% MODULAR GLOBAL 2025</p>
                            <p className="text-xl font-bold text-green-900">{globalStats.pctMod25.toFixed(2)}%</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                            <p className="text-xs font-bold text-green-700 uppercase mb-1">% MODULAR GLOBAL 2026</p>
                            <p className="text-xl font-bold text-green-900">{globalStats.pctMod26.toFixed(2)}%</p>
                        </div>
                        <div className="col-span-2 flex items-center p-4 text-xs text-gray-500 italic">
                            * % Calculado sobre facturación total del año
                        </div>
                    </>
                ) : (
                    <>
                        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                            <p className="text-xs font-bold text-indigo-700 uppercase mb-1">TOTAL TUYO 2025</p>
                            <p className="text-xl font-bold text-indigo-900">{formatCurrency(globalStats.tuyo25)}</p>
                        </div>
                        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                            <p className="text-xs font-bold text-indigo-700 uppercase mb-1">TOTAL TUYO 2026</p>
                            <p className="text-xl font-bold text-indigo-900">{formatCurrency(globalStats.tuyo26)}</p>
                        </div>
                    </>
                )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className={`bg-${color}-50 text-${color}-900 uppercase text-xs`}>
                            <tr>
                                <th className="p-4 font-bold w-16 text-center">#</th>
                                <th className="p-4 font-bold">Cliente</th>
                                <th className="p-4 font-bold text-right">Venta 2025</th>
                                <th className="p-4 font-bold text-right">Venta 2026</th>
                                <th className="p-4 font-bold text-right">Evolución</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {rankingData.map((c, i) => (
                                <tr key={i} className={`hover:bg-${color}-50/30 transition-colors`}>
                                    <td className="p-4 text-center text-gray-400 text-xs font-mono">{i + 1}</td>
                                    <td className="p-4"><div className="font-bold text-gray-800">{safeString(c.CLIENTE)}</div><div className="text-xs text-gray-400 font-mono">{safeString(c.N_CLIENTE)}</div></td>
                                    <td className={`p-4 text-right font-bold text-${color}-700 bg-${color}-50/30`}>{formatCurrency(c.val25)}</td>
                                    <td className="p-4 text-right text-gray-600">{formatCurrency(c.val26)}</td>
                                    <td className="p-4 text-right"><GrowthIndicator v25={c.val25} v26={c.val26} /></td>
                                </tr>
                            ))}
                            {rankingData.length === 0 && (
                                <tr><td colSpan="5" className="p-8 text-center text-gray-400 italic">No hay datos suficientes para calcular este ranking.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const PromosRankingView = ({ promosData }) => {
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedPromo, setSelectedPromo] = useState("");
    const [selectedAgent, setSelectedAgent] = useState("");

    const years = useMemo(() => [...new Set(promosData.map(p => safeString(p.ANO)))].filter(Boolean).sort((a, b) => b.localeCompare(a)), [promosData]);
    const promos = useMemo(() => [...new Set(promosData.map(p => safeString(p.PROMOCION)))].filter(Boolean).sort(), [promosData]);
    const agents = useMemo(() => [...new Set(promosData.map(p => safeString(p.COMERCIAL)))].filter(Boolean).sort(), [promosData]);

    const sortedPromos = useMemo(() => {
        let filtered = promosData;
        if (selectedYear) filtered = filtered.filter(p => safeString(p.ANO) === selectedYear);
        if (selectedPromo) filtered = filtered.filter(p => safeString(p.PROMOCION) === selectedPromo);
        if (selectedAgent) filtered = filtered.filter(p => safeString(p.COMERCIAL) === selectedAgent);

        return filtered.sort((a, b) => {
            if (a.ANO !== b.ANO) return String(b.ANO).localeCompare(String(a.ANO));
            return b.UNID - a.UNID;
        });
    }, [promosData, selectedYear, selectedPromo, selectedAgent]);

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Medal className="w-5 h-5 text-red-500" /> Comparativa Promociones</h2>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col sm:flex-row gap-4">
                <select className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-500 bg-white text-gray-700" value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
                    <option value="">-- Año --</option>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <select className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-500 bg-white text-gray-700" value={selectedPromo} onChange={e => setSelectedPromo(e.target.value)}>
                    <option value="">-- Seleccionar Promoción --</option>
                    {promos.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <select className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-500 bg-white text-gray-700" value={selectedAgent} onChange={e => setSelectedAgent(e.target.value)}>
                    <option value="">-- Todos los Agentes --</option>
                    {agents.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-red-50 text-red-900 uppercase text-xs">
                            <tr>
                                <th className="p-4 font-bold">Año</th>
                                <th className="p-4 font-bold">Promoción</th>
                                <th className="p-4 font-bold">Agente</th>
                                <th className="p-4 font-bold text-center w-24">Puesto</th>
                                <th className="p-4 font-bold text-right w-32">Unidades</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {sortedPromos.map((p, i) => (
                                <tr key={i} className="hover:bg-red-50/30 transition-colors">
                                    <td className="p-4 text-gray-500 font-mono">{safeString(p.ANO)}</td>
                                    <td className="p-4 font-bold text-gray-800">{safeString(p.PROMOCION)}</td>
                                    <td className="p-4 text-gray-700">{safeString(p.COMERCIAL)}</td>
                                    <td className="p-4 text-center">
                                        {p.PUESTO === 1 ? <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold border border-yellow-300">1º</span> : 
                                         p.PUESTO === 2 ? <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-bold border border-gray-300">2º</span> : 
                                         p.PUESTO === 3 ? <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-bold border border-orange-300">3º</span> : 
                                         <span className="text-gray-500 font-mono">{p.PUESTO}º</span>}
                                    </td>
                                    <td className="p-4 text-right font-bold text-red-600 font-mono">{p.UNID} u.</td>
                                </tr>
                            ))}
                            {sortedPromos.length === 0 && (
                                <tr><td colSpan="5" className="p-8 text-center text-gray-400 italic">No hay registros de promociones para mostrar.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// --- NUEVA VISTA DE COMPARATIVA DE AGENTES ---
const ComparativaView = ({ data, promosData, merskaData, seriesData }) => {
    const [agentA, setAgentA] = useState("");
    const [agentB, setAgentB] = useState("");

    const agentsList = useMemo(() => {
        return [...new Set(data.map(i => safeString(i.COMERCIAL)))].filter(Boolean).sort();
    }, [data]);

    const globalRanking24 = useMemo(() => {
        const sums = {};
        data.forEach(c => {
            const ag = safeString(c.COMERCIAL);
            if (!sums[ag]) sums[ag] = 0;
            sums[ag] += safeNumber(c.T_24);
        });
        const sorted = Object.entries(sums).sort((a, b) => b[1] - a[1]);
        return sorted.map(item => item[0]);
    }, [data]);

    const globalRanking25 = useMemo(() => {
        const sums = {};
        data.forEach(c => {
            const ag = safeString(c.COMERCIAL);
            if (!sums[ag]) sums[ag] = 0;
            sums[ag] += safeNumber(c.T_25);
        });
        const sorted = Object.entries(sums).sort((a, b) => b[1] - a[1]);
        return sorted.map(item => item[0]);
    }, [data]);

    const calculateMetrics = (agentName) => {
        if (!agentName) return null;
        
        const crmFiltered = data.filter(c => safeString(c.COMERCIAL) === agentName);
        const clientNames = crmFiltered.map(c => safeString(c.CLIENTE));
        
        const promosFiltered = promosData.filter(p => safeString(p.COMERCIAL).toUpperCase() === agentName.toUpperCase());

        let f24 = 0, act24 = 0, lost24 = 0;
        let cOver50K24=0, c50Kto10K24=0, c10Kto5K24=0, c5Kto1K24=0, c1Kto50024=0, cUnder50024=0;
        let vOver50K24=0, v50Kto10K24=0, v10Kto5K24=0, v5Kto1K24=0, v1Kto50024=0, vUnder50024=0;

        let f25 = 0, mod25Value = 0, act25 = 0, lost25 = 0;
        let cOver50K25=0, c50Kto10K25=0, c10Kto5K25=0, c5Kto1K25=0, c1Kto50025=0, cUnder50025=0;
        let vOver50K25=0, v50Kto10K25=0, v10Kto5K25=0, v5Kto1K25=0, v1Kto50025=0, vUnder50025=0;
        
        let f26 = 0, mod26Value = 0;
        let expoCount = 0;
        let tuyo25 = 0, tuyo26 = 0;

        crmFiltered.forEach(c => {
            const v24 = safeNumber(c.T_24);
            const v25 = safeNumber(c.T_25);
            const v26 = safeNumber(c.VTA_2026);

            f24 += v24;
            f25 += v25;
            f26 += v26;
            
            tuyo25 += safeNumber(c.TUYO_25);
            tuyo26 += safeNumber(c.TUYO_26);
            
            mod25Value += safeNumber(c.MOD_25);
            mod26Value += safeNumber(c.MOD_26);
            
            if (v24 > 0) act24++; else lost24++;
            if (v25 > 0) act25++; else lost25++;
            
            // Segmentación 2024
            if (v24 >= 50000) { cOver50K24++; vOver50K24 += v24; }
            else if (v24 >= 10000) { c50Kto10K24++; v50Kto10K24 += v24; }
            else if (v24 >= 5000) { c10Kto5K24++; v10Kto5K24 += v24; }
            else if (v24 >= 1000) { c5Kto1K24++; v5Kto1K24 += v24; }
            else if (v24 >= 500) { c1Kto50024++; v1Kto50024 += v24; }
            else if (v24 > 0) { cUnder50024++; vUnder50024 += v24; }

            // Segmentación 2025
            if (v25 >= 50000) { cOver50K25++; vOver50K25 += v25; }
            else if (v25 >= 10000) { c50Kto10K25++; v50Kto10K25 += v25; }
            else if (v25 >= 5000) { c10Kto5K25++; v10Kto5K25 += v25; }
            else if (v25 >= 1000) { c5Kto1K25++; v5Kto1K25 += v25; }
            else if (v25 >= 500) { c1Kto50025++; v1Kto50025 += v25; }
            else if (v25 > 0) { cUnder50025++; vUnder50025 += v25; }

            const expoString = safeString(c.EXPO_ROYO);
            if (expoString) {
                const lowerExpo = expoString.toLowerCase();
                if (lowerExpo !== "nada" && lowerExpo !== "no" && lowerExpo !== "0" && lowerExpo !== "-" && lowerExpo !== "pendiente") {
                    // Dividimos por comas o espacios para contar cada serie individualmente
                    const currentExpos = expoString.split(/[\s,]+/).filter(s => s.trim().length > 0 && s.toLowerCase() !== "nada" && s.toLowerCase() !== "no" && s !== "-");
                    expoCount += currentExpos.length;
                }
            }
        });
        
        const provs = [...new Set(crmFiltered.map(c => safeString(c.PROVINCIA)).filter(Boolean))].sort();

        let totalPot = 0, totalRy = 0, totalOb = 0;
        provs.forEach(p => {
            const mInfo = (merskaData || []).find(m => safeString(m.PROVINCIA).toUpperCase() === p.toUpperCase()) || {};
            totalPot += safeNumber(mInfo.M_POT);
            totalRy += safeNumber(mInfo.M_RY);
            totalOb += safeNumber(mInfo.M_OB);
        });

        let totalPromoUnits = 0;
        let sumPromoRank = 0;
        let countPromosRanked = 0;
        let countTotalPromos = promosFiltered.length;

        promosFiltered.forEach(p => {
            totalPromoUnits += safeNumber(p.UNID);
            if (safeNumber(p.PUESTO) > 0) {
                sumPromoRank += safeNumber(p.PUESTO);
                countPromosRanked++;
            }
        });
        
        // CÁLCULO DE TOP SERIES POR AGENTE
        let agentSeries = [];
        if (seriesData) {
            agentSeries = seriesData.filter(s => clientNames.includes(safeString(s.CLIENTE)));
        }
        const seriesGrouped = {};
        agentSeries.forEach(s => {
            const sName = safeString(s.SERIE);
            if (!seriesGrouped[sName]) seriesGrouped[sName] = { name: sName, v24: 0, v25: 0, v26: 0 };
            seriesGrouped[sName].v24 += s.VTA_2024;
            seriesGrouped[sName].v25 += s.VTA_2025;
            seriesGrouped[sName].v26 += s.VTA_2026;
        });
        const topSeries = Object.values(seriesGrouped).sort((a,b) => b.v25 - a.v25).slice(0, 4);

        return {
            y24: {
                facturacion: f24,
                ranking: globalRanking24.indexOf(agentName) + 1,
                avgVentaCte: act24 > 0 ? f24 / act24 : 0,
                activeClients: act24,
                lostClients: lost24, 
                ctesOver50K: cOver50K24, vOver50K: vOver50K24,
                ctes50Kto10K: c50Kto10K24, v50Kto10K: v50Kto10K24,
                ctes10Kto5K: c10Kto5K24, v10Kto5K: v10Kto5K24,
                ctes5Kto1K: c5Kto1K24, v5Kto1K: v5Kto1K24,
                ctes1Kto500: c1Kto50024, v1Kto500: v1Kto50024,
                ctesUnder500: cUnder50024, vUnder500: vUnder50024
            },
            y25: {
                facturacion: f25,
                ranking: globalRanking25.indexOf(agentName) + 1,
                pctModular: f25 > 0 ? (mod25Value / f25) * 100 : 0,
                avgVentaCte: act25 > 0 ? f25 / act25 : 0,
                activeClients: act25,
                lostClients: lost25,
                ctesOver50K: cOver50K25, vOver50K: vOver50K25,
                ctes50Kto10K: c50Kto10K25, v50Kto10K: v50Kto10K25,
                ctes10Kto5K: c10Kto5K25, v10Kto5K: v10Kto5K25,
                ctes5Kto1K: c5Kto1K25, v5Kto1K: v5Kto1K25,
                ctes1Kto500: c1Kto50025, v1Kto500: v1Kto50025,
                ctesUnder500: cUnder50025, vUnder500: vUnder50025
            },
            y26: {
                pctModular: f26 > 0 ? (mod26Value / f26) * 100 : 0
            },
            global: {
                tuyo25,
                tuyo26,
                expoCount,
                provs,
                totalPot,
                totalRy,
                totalOb,
                totalPromoUnits,
                mediaPorPromo: countTotalPromos > 0 ? (totalPromoUnits / countTotalPromos).toFixed(1) : "-",
                avgPromoRank: countPromosRanked > 0 ? (sumPromoRank / countPromosRanked).toFixed(1) : "-"
            },
            topSeries
        };
    };

    const metricsA = useMemo(() => calculateMetrics(agentA), [agentA, data, promosData, merskaData, seriesData, globalRanking24, globalRanking25]); 
    const metricsB = useMemo(() => calculateMetrics(agentB), [agentB, data, promosData, merskaData, seriesData, globalRanking24, globalRanking25]); 

    const getCellClass = (valSelf, valOther, higherIsBetter = true) => {
        if (valSelf === null || valOther === null || valSelf === "-" || valOther === "-") return "text-slate-800 font-medium";
        if (valSelf === valOther) return "text-slate-800 font-medium";
        
        const numSelf = Number(valSelf);
        const numOther = Number(valOther);
        
        if (isNaN(numSelf) || isNaN(numOther)) return "text-slate-800 font-medium";

        const selfWins = higherIsBetter ? numSelf > numOther : numSelf < numOther;
        return selfWins ? "text-blue-700 font-bold bg-blue-50/50" : "text-slate-800 font-medium";
    };
    
    const renderSegmentCell = (count, vol, totalClients, totalFacturacion, compareCount, isHigherBetter = true, hasRightBorder = false) => {
        const pctClients = totalClients > 0 ? ((count / totalClients) * 100).toFixed(1) : 0;
        const pctFact = totalFacturacion > 0 ? ((vol / totalFacturacion) * 100).toFixed(1) : 0;
        const colorClass = getCellClass(count, compareCount, isHigherBetter);
        return (
            <td className={`p-3 text-center align-middle ${hasRightBorder ? 'border-r border-gray-200' : ''} ${colorClass}`}>
                <div className="flex items-baseline justify-center gap-1 mb-1">
                    <span className="font-bold text-lg xl:text-xl leading-none">{count}</span>
                    <span className="text-xs font-medium opacity-70">({pctClients}%)</span>
                </div>
                <div className="flex items-baseline justify-center gap-1 mt-1">
                    <span className="text-sm font-semibold opacity-90 leading-none">{formatCurrency(vol).replace(' €', '')}</span>
                    <span className="text-[10px] font-medium opacity-70">({pctFact}%)</span>
                </div>
            </td>
        );
    };

    const handleDownloadPDF = () => {
        if (!window.html2pdf) {
            alert("La librería de PDF aún se está cargando. Intenta en unos segundos.");
            return;
        }
        const element = document.getElementById('comparativa-report');
        const opt = {
            margin:       10,
            filename:     `Comparativa_${agentA}_vs_${agentB}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        window.html2pdf().set(opt).from(element).save();
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2"><GitCompare className="w-5 h-5 text-blue-600" /> Comparativa de Agentes (Resultados 24/25)</h2>
                    <div className="flex gap-2">
                        {agentA && agentB && (
                            <button onClick={handleDownloadPDF} className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all font-bold text-sm">
                                <Download className="w-4 h-4" /> Descargar PDF
                            </button>
                        )}
                    </div>
                </div>
                
                <div className="mt-6 flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Selecciona Agente 1</label>
                        <select className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={agentA} onChange={e => setAgentA(e.target.value)}>
                            <option value="">-- Agente 1 --</option>
                            {agentsList.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                    </div>
                    <div className="flex items-center justify-center pt-6 md:pt-4 text-gray-300">VS</div>
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Selecciona Agente 2</label>
                        <select className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={agentB} onChange={e => setAgentB(e.target.value)}>
                            <option value="">-- Agente 2 --</option>
                            {agentsList.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {agentA && agentB && metricsA && metricsB ? (
                <div id="comparativa-report" className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-x-auto">
                    <div className="p-6 border-b border-gray-100 bg-slate-50 flex items-center gap-3 min-w-[700px]">
                         <GitCompare className="w-6 h-6 text-blue-600" />
                         <div>
                             <h3 className="font-bold text-lg text-slate-800">Informe Comparativo (2024 - 2025)</h3>
                             <p className="text-sm text-slate-500">{agentA} vs {agentB}</p>
                         </div>
                    </div>
                    <table className="w-full text-sm text-left min-w-[700px]">
                        <thead className="bg-blue-100 text-blue-900 uppercase text-xs">
                            <tr>
                                <th rowSpan="2" className="p-4 font-bold border-b border-blue-200 align-bottom w-1/3">Métrica Analizada</th>
                                <th colSpan="2" className="p-3 font-bold text-center border-b border-blue-200 border-r border-blue-200 w-1/3 text-blue-800">{agentA}</th>
                                <th colSpan="2" className="p-3 font-bold text-center border-b border-blue-200 w-1/3 text-blue-800">{agentB}</th>
                            </tr>
                            <tr>
                                <th className="p-2 font-bold text-center border-b border-blue-200 bg-blue-50/50">2024</th>
                                <th className="p-2 font-bold text-center border-b border-blue-200 border-r border-blue-200 bg-blue-50/50">2025</th>
                                <th className="p-2 font-bold text-center border-b border-blue-200 bg-blue-50/50">2024</th>
                                <th className="p-2 font-bold text-center border-b border-blue-200 bg-blue-50/50">2025</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {/* Facturación Global */}
                            <tr className="hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-700">Facturación Total</td>
                                <td className={`p-3 text-center text-base ${getCellClass(metricsA.y24.facturacion, metricsB.y24.facturacion)}`}>{formatCurrency(metricsA.y24.facturacion)}</td>
                                <td className={`p-3 text-center text-base border-r border-gray-200 ${getCellClass(metricsA.y25.facturacion, metricsB.y25.facturacion)}`}>{formatCurrency(metricsA.y25.facturacion)}</td>
                                <td className={`p-3 text-center text-base ${getCellClass(metricsB.y24.facturacion, metricsA.y24.facturacion)}`}>{formatCurrency(metricsB.y24.facturacion)}</td>
                                <td className={`p-3 text-center text-base ${getCellClass(metricsB.y25.facturacion, metricsA.y25.facturacion)}`}>{formatCurrency(metricsB.y25.facturacion)}</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-700">Ranking Venta Zona Noreste</td>
                                <td className={`p-3 text-center ${getCellClass(metricsA.y24.ranking, metricsB.y24.ranking, false)}`}>{metricsA.y24.ranking}º</td>
                                <td className={`p-3 text-center border-r border-gray-200 ${getCellClass(metricsA.y25.ranking, metricsB.y25.ranking, false)}`}>{metricsA.y25.ranking}º</td>
                                <td className={`p-3 text-center ${getCellClass(metricsB.y24.ranking, metricsA.y24.ranking, false)}`}>{metricsB.y24.ranking}º</td>
                                <td className={`p-3 text-center ${getCellClass(metricsB.y25.ranking, metricsA.y25.ranking, false)}`}>{metricsB.y25.ranking}º</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-700">
                                    % Modular <span className="text-[10px] text-gray-400 block font-normal">(2025 vs 2026)</span>
                                </td>
                                <td className={`p-3 text-center ${getCellClass(metricsA.y25.pctModular, metricsB.y25.pctModular)}`}>
                                    {metricsA.y25.pctModular.toFixed(2)}%
                                    <span className="block text-[9px] text-gray-400 font-normal mt-0.5">en 2025</span>
                                </td>
                                <td className={`p-3 text-center border-r border-gray-200 ${getCellClass(metricsA.y26.pctModular, metricsB.y26.pctModular)}`}>
                                    {metricsA.y26.pctModular.toFixed(2)}%
                                    <span className="block text-[9px] text-gray-400 font-normal mt-0.5">en 2026</span>
                                </td>
                                <td className={`p-3 text-center ${getCellClass(metricsB.y25.pctModular, metricsA.y25.pctModular)}`}>
                                    {metricsB.y25.pctModular.toFixed(2)}%
                                    <span className="block text-[9px] text-gray-400 font-normal mt-0.5">en 2025</span>
                                </td>
                                <td className={`p-3 text-center ${getCellClass(metricsB.y26.pctModular, metricsA.y26.pctModular)}`}>
                                    {metricsB.y26.pctModular.toFixed(2)}%
                                    <span className="block text-[9px] text-gray-400 font-normal mt-0.5">en 2026</span>
                                </td>
                            </tr>

                            {/* Cartera de Clientes */}
                            <tr className="bg-slate-200 border-y border-slate-300"><td colSpan="5" className="p-3 text-xs font-bold text-slate-800 uppercase tracking-widest pl-4">Cartera de Clientes (2024 - 2025)</td></tr>
                            
                            <tr className="hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-700">Media de Venta por Cliente Activo</td>
                                <td className={`p-3 text-center ${getCellClass(metricsA.y24.avgVentaCte, metricsB.y24.avgVentaCte)}`}>{formatCurrency(metricsA.y24.avgVentaCte)}</td>
                                <td className={`p-3 text-center border-r border-gray-200 ${getCellClass(metricsA.y25.avgVentaCte, metricsB.y25.avgVentaCte)}`}>{formatCurrency(metricsA.y25.avgVentaCte)}</td>
                                <td className={`p-3 text-center ${getCellClass(metricsB.y24.avgVentaCte, metricsA.y24.avgVentaCte)}`}>{formatCurrency(metricsB.y24.avgVentaCte)}</td>
                                <td className={`p-3 text-center ${getCellClass(metricsB.y25.avgVentaCte, metricsA.y25.avgVentaCte)}`}>{formatCurrency(metricsB.y25.avgVentaCte)}</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-700">Nº de Clientes con compra</td>
                                <td className={`p-3 text-center ${getCellClass(metricsA.y24.activeClients, metricsB.y24.activeClients)}`}>{metricsA.y24.activeClients}</td>
                                <td className={`p-3 text-center border-r border-gray-200 ${getCellClass(metricsA.y25.activeClients, metricsB.y25.activeClients)}`}>{metricsA.y25.activeClients}</td>
                                <td className={`p-3 text-center ${getCellClass(metricsB.y24.activeClients, metricsA.y24.activeClients)}`}>{metricsB.y24.activeClients}</td>
                                <td className={`p-3 text-center ${getCellClass(metricsB.y25.activeClients, metricsA.y25.activeClients)}`}>{metricsB.y25.activeClients}</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-700">Nº Clientes sin compra (Inactivos)</td>
                                <td className={`p-3 text-center ${getCellClass(metricsA.y24.lostClients, metricsB.y24.lostClients, false)}`}>{metricsA.y24.lostClients}</td>
                                <td className={`p-3 text-center border-r border-gray-200 ${getCellClass(metricsA.y25.lostClients, metricsB.y25.lostClients, false)}`}>{metricsA.y25.lostClients}</td>
                                <td className={`p-3 text-center ${getCellClass(metricsB.y24.lostClients, metricsA.y24.lostClients, false)}`}>{metricsB.y24.lostClients}</td>
                                <td className={`p-3 text-center ${getCellClass(metricsB.y25.lostClients, metricsA.y25.lostClients, false)}`}>{metricsB.y25.lostClients}</td>
                            </tr>

                            {/* Segmentación por Volumen */}
                            <tr className="bg-slate-200 border-y border-slate-300"><td colSpan="5" className="p-3 text-xs font-bold text-slate-800 uppercase tracking-widest pl-4">Segmentación por Volumen (2024 - 2025)</td></tr>

                            <tr className="hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-700">Clientes &gt; 50.000€</td>
                                {renderSegmentCell(metricsA.y24.ctesOver50K, metricsA.y24.vOver50K, metricsA.y24.activeClients, metricsA.y24.facturacion, metricsB.y24.ctesOver50K, true, false)}
                                {renderSegmentCell(metricsA.y25.ctesOver50K, metricsA.y25.vOver50K, metricsA.y25.activeClients, metricsA.y25.facturacion, metricsB.y25.ctesOver50K, true, true)}
                                {renderSegmentCell(metricsB.y24.ctesOver50K, metricsB.y24.vOver50K, metricsB.y24.activeClients, metricsB.y24.facturacion, metricsA.y24.ctesOver50K, true, false)}
                                {renderSegmentCell(metricsB.y25.ctesOver50K, metricsB.y25.vOver50K, metricsB.y25.activeClients, metricsB.y25.facturacion, metricsA.y25.ctesOver50K, true, false)}
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-700">Clientes entre 50.000€ y 10.000€</td>
                                {renderSegmentCell(metricsA.y24.ctes50Kto10K, metricsA.y24.v50Kto10K, metricsA.y24.activeClients, metricsA.y24.facturacion, metricsB.y24.ctes50Kto10K, true, false)}
                                {renderSegmentCell(metricsA.y25.ctes50Kto10K, metricsA.y25.v50Kto10K, metricsA.y25.activeClients, metricsA.y25.facturacion, metricsB.y25.ctes50Kto10K, true, true)}
                                {renderSegmentCell(metricsB.y24.ctes50Kto10K, metricsB.y24.v50Kto10K, metricsB.y24.activeClients, metricsB.y24.facturacion, metricsA.y24.ctes50Kto10K, true, false)}
                                {renderSegmentCell(metricsB.y25.ctes50Kto10K, metricsB.y25.v50Kto10K, metricsB.y25.activeClients, metricsB.y25.facturacion, metricsA.y25.ctes50Kto10K, true, false)}
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-700">Clientes entre 10.000€ y 5.000€</td>
                                {renderSegmentCell(metricsA.y24.ctes10Kto5K, metricsA.y24.v10Kto5K, metricsA.y24.activeClients, metricsA.y24.facturacion, metricsB.y24.ctes10Kto5K, true, false)}
                                {renderSegmentCell(metricsA.y25.ctes10Kto5K, metricsA.y25.v10Kto5K, metricsA.y25.activeClients, metricsA.y25.facturacion, metricsB.y25.ctes10Kto5K, true, true)}
                                {renderSegmentCell(metricsB.y24.ctes10Kto5K, metricsB.y24.v10Kto5K, metricsB.y24.activeClients, metricsB.y24.facturacion, metricsA.y24.ctes10Kto5K, true, false)}
                                {renderSegmentCell(metricsB.y25.ctes10Kto5K, metricsB.y25.v10Kto5K, metricsB.y25.activeClients, metricsB.y25.facturacion, metricsA.y25.ctes10Kto5K, true, false)}
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-700">Clientes entre 5.000€ y 1.000€</td>
                                {renderSegmentCell(metricsA.y24.ctes5Kto1K, metricsA.y24.v5Kto1K, metricsA.y24.activeClients, metricsA.y24.facturacion, metricsB.y24.ctes5Kto1K, true, false)}
                                {renderSegmentCell(metricsA.y25.ctes5Kto1K, metricsA.y25.v5Kto1K, metricsA.y25.activeClients, metricsA.y25.facturacion, metricsB.y25.ctes5Kto1K, true, true)}
                                {renderSegmentCell(metricsB.y24.ctes5Kto1K, metricsB.y24.v5Kto1K, metricsB.y24.activeClients, metricsB.y24.facturacion, metricsA.y24.ctes5Kto1K, true, false)}
                                {renderSegmentCell(metricsB.y25.ctes5Kto1K, metricsB.y25.v5Kto1K, metricsB.y25.activeClients, metricsB.y25.facturacion, metricsA.y25.ctes5Kto1K, true, false)}
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-700">Clientes entre 1.000€ y 500€</td>
                                {renderSegmentCell(metricsA.y24.ctes1Kto500, metricsA.y24.v1Kto500, metricsA.y24.activeClients, metricsA.y24.facturacion, metricsB.y24.ctes1Kto500, false, false)}
                                {renderSegmentCell(metricsA.y25.ctes1Kto500, metricsA.y25.v1Kto500, metricsA.y25.activeClients, metricsA.y25.facturacion, metricsB.y25.ctes1Kto500, false, true)}
                                {renderSegmentCell(metricsB.y24.ctes1Kto500, metricsB.y24.v1Kto500, metricsB.y24.activeClients, metricsB.y24.facturacion, metricsA.y24.ctes1Kto500, false, false)}
                                {renderSegmentCell(metricsB.y25.ctes1Kto500, metricsB.y25.v1Kto500, metricsB.y25.activeClients, metricsB.y25.facturacion, metricsA.y25.ctes1Kto500, false, false)}
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-700">Clientes con compra &lt; 500€</td>
                                {renderSegmentCell(metricsA.y24.ctesUnder500, metricsA.y24.vUnder500, metricsA.y24.activeClients, metricsA.y24.facturacion, metricsB.y24.ctesUnder500, false, false)}
                                {renderSegmentCell(metricsA.y25.ctesUnder500, metricsA.y25.vUnder500, metricsA.y25.activeClients, metricsA.y25.facturacion, metricsB.y25.ctesUnder500, false, true)}
                                {renderSegmentCell(metricsB.y24.ctesUnder500, metricsB.y24.vUnder500, metricsB.y24.activeClients, metricsB.y24.facturacion, metricsA.y24.ctesUnder500, false, false)}
                                {renderSegmentCell(metricsB.y25.ctesUnder500, metricsB.y25.vUnder500, metricsB.y25.activeClients, metricsB.y25.facturacion, metricsA.y25.ctesUnder500, false, false)}
                            </tr>

                            {/* Tuyo */}
                            <tr className="bg-slate-200 border-y border-slate-300"><td colSpan="5" className="p-3 text-xs font-bold text-slate-800 uppercase tracking-widest pl-4">Ventas Serie Tuyo (2025 - 2026)</td></tr>
                            <tr className="hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-700">Tuyo 2025</td>
                                <td colSpan="2" className={`p-3 text-center text-base border-r border-gray-200 ${getCellClass(metricsA.global.tuyo25, metricsB.global.tuyo25)}`}>{formatCurrency(metricsA.global.tuyo25)}</td>
                                <td colSpan="2" className={`p-3 text-center text-base ${getCellClass(metricsB.global.tuyo25, metricsA.global.tuyo25)}`}>{formatCurrency(metricsB.global.tuyo25)}</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-700">Tuyo 2026</td>
                                <td colSpan="2" className={`p-3 text-center text-base border-r border-gray-200 ${getCellClass(metricsA.global.tuyo26, metricsB.global.tuyo26)}`}>{formatCurrency(metricsA.global.tuyo26)}</td>
                                <td colSpan="2" className={`p-3 text-center text-base ${getCellClass(metricsB.global.tuyo26, metricsA.global.tuyo26)}`}>{formatCurrency(metricsB.global.tuyo26)}</td>
                            </tr>

                            {/* Exposiciones y Promos */}
                            <tr className="bg-slate-200 border-y border-slate-300"><td colSpan="5" className="p-3 text-xs font-bold text-slate-800 uppercase tracking-widest pl-4">Visibilidad y Promociones (2024-2026)</td></tr>

                            <tr className="hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-700">Nº de Series Totales en Exposición</td>
                                <td colSpan="2" className={`p-4 text-center border-r border-gray-200 ${getCellClass(metricsA.global.expoCount, metricsB.global.expoCount)}`}>{metricsA.global.expoCount}</td>
                                <td colSpan="2" className={`p-4 text-center ${getCellClass(metricsB.global.expoCount, metricsA.global.expoCount)}`}>{metricsB.global.expoCount}</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-700">Muebles colocados en promociones</td>
                                <td colSpan="2" className={`p-4 text-center border-r border-gray-200 ${getCellClass(metricsA.global.totalPromoUnits, metricsB.global.totalPromoUnits)}`}>{metricsA.global.totalPromoUnits} u.</td>
                                <td colSpan="2" className={`p-4 text-center ${getCellClass(metricsB.global.totalPromoUnits, metricsA.global.totalPromoUnits)}`}>{metricsB.global.totalPromoUnits} u.</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-700">Media de muebles por promoción</td>
                                <td colSpan="2" className={`p-4 text-center border-r border-gray-200 ${getCellClass(metricsA.global.mediaPorPromo, metricsB.global.mediaPorPromo)}`}>{metricsA.global.mediaPorPromo}</td>
                                <td colSpan="2" className={`p-4 text-center ${getCellClass(metricsB.global.mediaPorPromo, metricsA.global.mediaPorPromo)}`}>{metricsB.global.mediaPorPromo}</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-700">Media en ranking promociones</td>
                                <td colSpan="2" className={`p-4 text-center border-r border-gray-200 ${getCellClass(metricsA.global.avgPromoRank, metricsB.global.avgPromoRank, false)}`}>{metricsA.global.avgPromoRank}º</td>
                                <td colSpan="2" className={`p-4 text-center ${getCellClass(metricsB.global.avgPromoRank, metricsA.global.avgPromoRank, false)}`}>{metricsB.global.avgPromoRank}º</td>
                            </tr>

                            {/* Merska / Geográfico */}
                            <tr className="bg-slate-200 border-y border-slate-300"><td colSpan="5" className="p-3 text-xs font-bold text-slate-800 uppercase tracking-widest pl-4">Análisis Geográfico (Índices Merska)</td></tr>
                            <tr className="hover:bg-gray-50 border-b border-gray-100">
                                <td className="p-4 font-medium text-gray-700 align-top">
                                    Desglose por Provincia<br/>
                                    <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block mt-1">PROV: M_POT | M_RY | M_OB</span>
                                </td>
                                <td colSpan="2" className="p-4 align-top border-r border-gray-200">
                                    <div className="space-y-1.5 flex flex-wrap gap-2">
                                        {metricsA.global.provs.map(p => {
                                            const mInfo = (merskaData || []).find(m => safeString(m.PROVINCIA).toUpperCase() === p.toUpperCase()) || {};
                                            return (
                                                <div key={p} className="text-xs flex flex-col p-1.5 bg-blue-50/50 rounded border border-blue-100 min-w-[200px]">
                                                    <span className="font-bold text-blue-800">{p}</span>
                                                    <span className="text-gray-600 font-mono mt-0.5">POT: {formatPercentage(mInfo.M_POT)} | <span className={`px-1 rounded ${getMerskaColorClass(mInfo.M_POT, mInfo.M_RY)}`}>RY: {formatPercentage(mInfo.M_RY)}</span> | OB: {formatPercentage(mInfo.M_OB)}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </td>
                                <td colSpan="2" className="p-4 align-top">
                                    <div className="space-y-1.5 flex flex-wrap gap-2">
                                        {metricsB.global.provs.map(p => {
                                            const mInfo = (merskaData || []).find(m => safeString(m.PROVINCIA).toUpperCase() === p.toUpperCase()) || {};
                                            return (
                                                <div key={p} className="text-xs flex flex-col p-1.5 bg-blue-50/50 rounded border border-blue-100 min-w-[200px]">
                                                    <span className="font-bold text-blue-800">{p}</span>
                                                    <span className="text-gray-600 font-mono mt-0.5">POT: {formatPercentage(mInfo.M_POT)} | <span className={`px-1 rounded ${getMerskaColorClass(mInfo.M_POT, mInfo.M_RY)}`}>RY: {formatPercentage(mInfo.M_RY)}</span> | OB: {formatPercentage(mInfo.M_OB)}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-700 align-middle">
                                    Totales Acumulados
                                </td>
                                <td colSpan="2" className="p-4 align-middle border-r border-gray-200">
                                    {metricsA.global.provs.length > 0 ? (
                                        <div className="text-sm flex flex-col p-3 bg-blue-100 rounded border border-blue-300 w-full text-center">
                                            <span className="font-extrabold text-blue-900 mb-1">TOTALES MERSKA</span>
                                            <span className="text-gray-800 font-mono font-bold">POT: {formatPercentage(metricsA.global.totalPot)} | <span className={`px-2 py-0.5 rounded ${getMerskaColorClass(metricsA.global.totalPot, metricsA.global.totalRy)}`}>RY: {formatPercentage(metricsA.global.totalRy)}</span> | OB: {formatPercentage(metricsA.global.totalOb)}</span>
                                        </div>
                                    ) : <div className="text-center text-gray-400 italic">-</div>}
                                </td>
                                <td colSpan="2" className="p-4 align-middle">
                                    {metricsB.global.provs.length > 0 ? (
                                        <div className="text-sm flex flex-col p-3 bg-blue-100 rounded border border-blue-300 w-full text-center">
                                            <span className="font-extrabold text-blue-900 mb-1">TOTALES MERSKA</span>
                                            <span className="text-gray-800 font-mono font-bold">POT: {formatPercentage(metricsB.global.totalPot)} | <span className={`px-2 py-0.5 rounded ${getMerskaColorClass(metricsB.global.totalPot, metricsB.global.totalRy)}`}>RY: {formatPercentage(metricsB.global.totalRy)}</span> | OB: {formatPercentage(metricsB.global.totalOb)}</span>
                                        </div>
                                    ) : <div className="text-center text-gray-400 italic">-</div>}
                                </td>
                            </tr>

                            {/* Series Principales */}
                            <tr className="bg-slate-200 border-y border-slate-300">
                                <td colSpan="5" className="p-3 text-xs font-bold text-slate-800 uppercase tracking-widest pl-4">
                                    Ventas series principales 2024 - 2025
                                </td>
                            </tr>
                            {[0, 1, 2, 3].map(index => {
                                const sA = metricsA.topSeries[index];
                                const sB = metricsB.topSeries[index];
                                if (!sA && !sB) return null;
                                
                                return (
                                    <tr key={`serie-${index}`} className="hover:bg-gray-50">
                                        <td className="p-4 font-medium text-gray-700">Serie Top {index + 1}</td>
                                        
                                        <td className="p-3 text-center border-l border-gray-100">
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{sA ? sA.name : "-"}</div>
                                            <div className="text-sm font-medium">{sA ? formatCurrency(sA.v24) : "-"}</div>
                                        </td>
                                        <td className="p-3 text-center border-r border-gray-200 bg-blue-50/20">
                                            <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">{sA ? sA.name : "-"}</div>
                                            <div className="text-sm font-bold text-blue-900">{sA ? formatCurrency(sA.v25) : "-"}</div>
                                        </td>
                                        
                                        <td className="p-3 text-center">
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{sB ? sB.name : "-"}</div>
                                            <div className="text-sm font-medium">{sB ? formatCurrency(sB.v24) : "-"}</div>
                                        </td>
                                        <td className="p-3 text-center border-r border-gray-100 bg-blue-50/20">
                                            <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">{sB ? sB.name : "-"}</div>
                                            <div className="text-sm font-bold text-blue-900">{sB ? formatCurrency(sB.v25) : "-"}</div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl bg-white mt-6">
                    <GitCompare className="w-12 h-12 text-gray-300 mb-4" />
                    <p className="text-lg font-medium text-gray-500">Selecciona dos agentes para iniciar la comparativa.</p>
                </div>
            )}
        </div>
    );
};

// --- ESTRUCTURA PRINCIPAL ---

const Sidebar = ({ activeMode, setMode, isOpen, onClose, lastUpdated }) => {
  const menuItems = [
    { id: 'HOME', label: 'Inicio', icon: Home },
    { type: 'separator' },
    { id: 'CLIENTE', label: 'Cliente', icon: User },
    { id: 'AGENTE', label: 'Agente', icon: Users },
    { id: 'PROVINCIA', label: 'Provincia', icon: MapPin },
    { id: 'GRUPO', label: 'Grupos', icon: Store },
    { id: 'VISITA', label: 'Registro Visitas', icon: Calendar },
    { id: 'COMPARATIVA', label: 'Comparativa Agentes', icon: GitCompare },
    { type: 'separator' },
    { id: 'SERIES', label: 'Series', icon: Package },
    { id: 'MODULAR', label: 'Modular', icon: Grid },
    { id: 'TUYO', label: 'Tuyo', icon: Star },
    { id: 'PROMOS', label: 'Promociones', icon: Medal }, 
  ];
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm" onClick={onClose} />}
      <div className={`fixed top-0 left-0 h-full w-64 bg-slate-900 text-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex flex-col`}>
        <div className="p-6 border-b border-slate-800 flex justify-between items-center"><div><h1 className="text-xl font-bold flex items-center gap-2 text-white"><Database className="w-6 h-6 text-blue-400" /> DATOS VENTAS</h1><p className="text-xs text-slate-400 mt-1">Dashboard Comercial 2026</p></div><button onClick={onClose} className="md:hidden text-slate-400 hover:text-white"><X className="w-6 h-6" /></button></div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">{menuItems.map((item, idx) => item.type === 'separator' ? <div key={idx} className="h-px bg-slate-800 my-4 mx-2"></div> : (<button key={item.id} onClick={() => { setMode(item.id); onClose(); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeMode === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><item.icon className={`w-5 h-5 ${activeMode === item.id ? 'text-white' : 'text-slate-500'}`} />{item.label}</button>))}</nav>
        <div className="p-4 border-t border-slate-800">{lastUpdated && (<div className="mb-3 text-[10px] text-green-400 bg-green-900/30 p-2 rounded border border-green-800"><span className="block font-bold">Datos del:</span> {new Date(lastUpdated).toLocaleString()}</div>)}<div className="flex flex-col gap-1 text-[10px] text-slate-600 font-mono"><div className="flex justify-between"><span>Versión:</span><span className="text-white">{APP_VERSION}</span></div><div className="flex justify-between items-center bg-slate-800 p-1 rounded"><span>ID App:</span><span className="text-orange-400 font-bold select-all" title="Verifica que coincide con el enlace">{appId.slice(-6)}</span></div></div></div>
      </div>
    </>
  );
};

export default function App() {
  const [activeMode, setActiveMode] = useState('HOME');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNewVisitOpen, setIsNewVisitOpen] = useState(false);
  const [isNewQuoteOpen, setIsNewQuoteOpen] = useState(false); 
  const [rawCrmData, setRawCrmData] = useState([]); 
  const [seriesData, setSeriesData] = useState([]);
  const [promosData, setPromosData] = useState([]); 
  const [offersData, setOffersData] = useState([]); 
  const [incidentsData, setIncidentsData] = useState([]); 
  const [merskaData, setMerskaData] = useState([]); 
  const [manualVisits, setManualVisits] = useState({});
  const [manualQuotes, setManualQuotes] = useState({}); 
  const [clientUpdates, setClientUpdates] = useState({});
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [libReady, setLibReady] = useState(false);
  const [user, setUser] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false); 
  const [syncStatus, setSyncStatus] = useState("loading");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState(false);

  useEffect(() => { const savedAdmin = localStorage.getItem('vt_admin_mode'); if (savedAdmin === 'true') setIsAdmin(true); }, []);
  const handleAdminToggle = () => { if (isAdmin) { setIsAdmin(false); localStorage.removeItem('vt_admin_mode'); setIsUploadOpen(false); } else { setShowAdminLogin(true); } };
  const handleAdminSubmit = (e) => { e.preventDefault(); if (adminPassword === "admin") { setIsAdmin(true); localStorage.setItem('vt_admin_mode', 'true'); setIsUploadOpen(true); setShowAdminLogin(false); setAdminPassword(""); setLoginError(false); } else { setLoginError(true); } };
  
  useEffect(() => { 
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (error) {
        console.error("Error de autenticación:", error);
      }
    };
    initAuth(); 
    return onAuthStateChanged(auth, setUser);
  }, []);

  useEffect(() => { 
      if (!user) return; 
      const visitsRef = collection(db, 'visits');
      const updatesRef = collection(db, 'client_updates');
      const quotesRef = collection(db, 'quotes');
      
      const unsubVisits = onSnapshot(query(visitsRef), (snapshot) => { 
          const vMap = {}; snapshot.forEach(doc => { vMap[doc.id] = doc.data(); }); setManualVisits(vMap); 
      }, (e) => console.error(e)); 
      
      const unsubUpdates = onSnapshot(query(updatesRef), (snapshot) => { 
          const uMap = {}; snapshot.forEach(doc => { const d = doc.data(); if(d.nClient) uMap[d.nClient] = d; }); setClientUpdates(uMap); 
      }, (e) => console.error(e)); 
      
      const unsubQuotes = onSnapshot(query(quotesRef), (snapshot) => { 
          const qMap = {}; snapshot.forEach(doc => { qMap[doc.id] = doc.data(); }); setManualQuotes(qMap); 
      }, (e) => console.error(e)); 
      
      return () => { unsubVisits(); unsubUpdates(); unsubQuotes(); }; 
  }, [user]);

  // --- OPTIMIZACIÓN AQUÍ: CARGA DE FRAGMENTOS LIMPIA ---
  useEffect(() => {
    if (!user) return;
    setSyncStatus("loading");
    const manifestRef = doc(db, 'data_chunks', 'manifest');
    
    const unsubscribe = onSnapshot(manifestRef, async (docSnap) => {
      if (!docSnap.exists()) {
        setDataLoaded(true);
        setSyncStatus("empty");
        return;
      }
      
      const manifest = docSnap.data();
      setLastUpdated(manifest.updatedAt);
      const chunksRef = collection(db, 'data_chunks');
      
      const loadCollection = async (count, prefix) => {
          if (!count) return [];
          const promises = [];
          for (let i = 0; i < count; i++) promises.push(getDoc(doc(chunksRef, `${prefix}${i}`)));
          const docs = await Promise.all(promises);
          return docs.filter(d => d.exists()).flatMap(d => d.data().data || []);
      };

      try {
        const [crm, series, promos, offers, incidents, merska] = await Promise.all([
            loadCollection(manifest.crmChunks, 'crm_chunk_'),
            loadCollection(manifest.seriesChunks, 'series_chunk_'),
            loadCollection(manifest.promosChunks, 'promos_chunk_'),
            loadCollection(manifest.offersChunks, 'offers_chunk_'),
            loadCollection(manifest.incidentsChunks, 'incidents_chunk_'),
            loadCollection(manifest.merskaChunks, 'merska_chunk_')
        ]);
        
        setRawCrmData(crm);
        setSeriesData(series);
        setPromosData(promos);
        setOffersData(offers);
        setIncidentsData(incidents);
        setMerskaData(merska);
        
        setDataLoaded(true);
        setSyncStatus("synced");
      } catch (error) {
        console.error("Error cargando datos:", error);
        setSyncStatus("error");
      }
    }, (e) => console.error("Error en Snapshot:", e));
    
    return () => unsubscribe();
  }, [user, reloadTrigger]);
  
  useEffect(() => { 
      const scriptXlsx = document.createElement('script'); 
      scriptXlsx.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"; 
      scriptXlsx.async = true; 
      scriptXlsx.onload = () => setLibReady(true); 
      document.body.appendChild(scriptXlsx); 

      const scriptPdf = document.createElement('script');
      scriptPdf.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
      scriptPdf.async = true;
      document.body.appendChild(scriptPdf);

      return () => { 
          document.body.removeChild(scriptXlsx); 
          document.body.removeChild(scriptPdf);
      } 
  }, []);

  const crmData = useMemo(() => { if (rawCrmData.length === 0) return []; return rawCrmData.map(client => { let finalClient = { ...client }; if (clientUpdates[client.N_CLIENTE]) finalClient.COMPRADOR = clientUpdates[client.N_CLIENTE].contact; const clientVisits = Object.values(manualVisits).filter(v => v.nClient === client.N_CLIENTE); if (clientVisits.length > 0) { clientVisits.sort((a,b) => (parseDateObj(b.date) || new Date(0)) - (parseDateObj(a.date) || new Date(0))); const lastVisit = clientVisits[0]; const excelDate = parseDateObj(client.F_VISITA); const manualDate = parseDateObj(lastVisit.date); if (!excelDate || (manualDate && manualDate >= excelDate)) { finalClient.F_VISITA = lastVisit.date; finalClient.NOTA_VISITA = lastVisit.note; if (lastVisit.promotions) finalClient.PROMOCIONES = lastVisit.promotions; if (lastVisit.expo) finalClient.EXPO_ROYO = lastVisit.expo; } } return finalClient; }); }, [rawCrmData, manualVisits, clientUpdates]);
  const handleExcelUpload = (e) => { const file = e.target.files[0]; if (!file) return; if (!libReady || !window.XLSX) { alert("Cargando sistema..."); return; } setLoading(true); const reader = new FileReader(); reader.onload = async (evt) => { try { const data = new Uint8Array(evt.target.result); const workbook = window.XLSX.read(data, { type: 'array' }); let loadedCrm=[], loadedSeries=[], loadedPromos=[], loadedOffers=[], loadedIncidents=[], loadedMerska=[], foundCrm=false, foundSeries=false, foundPromos=false, foundOffers=false, foundIncidents=false, foundMerska=false; workbook.SheetNames.forEach(sheetName => { const json = window.XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]); const lower = sheetName.toLowerCase(); if (lower.includes('crm')) { loadedCrm = normalizeData(json, 'CRM'); foundCrm = true; } else if (lower.includes('serie')) { loadedSeries = normalizeData(json, 'SERIES'); foundSeries = true; } else if (lower.includes('promo')) { loadedPromos = normalizeData(json, 'PROMOS'); foundPromos = true; } else if (lower.includes('oferta')) { loadedOffers = normalizeData(json, 'OFERTAS'); foundOffers = true; } else if (lower.includes('incidencia')) { loadedIncidents = normalizeData(json, 'INCIDENCIAS'); foundIncidents = true; } else if (lower.includes('merska')) { loadedMerska = normalizeData(json, 'MERSKA'); foundMerska = true; } }); if (foundCrm && foundSeries) { const cleanCrm = JSON.parse(JSON.stringify(loadedCrm)); const cleanSeries = JSON.parse(JSON.stringify(loadedSeries)); const cleanPromos = foundPromos ? JSON.parse(JSON.stringify(loadedPromos)) : []; const cleanOffers = foundOffers ? JSON.parse(JSON.stringify(loadedOffers)) : []; const cleanIncidents = foundIncidents ? JSON.parse(JSON.stringify(loadedIncidents)) : []; const cleanMerska = foundMerska ? JSON.parse(JSON.stringify(loadedMerska)) : []; const chunkArray = (arr, size) => { const r=[]; for(let i=0;i<arr.length;i+=size) r.push(arr.slice(i,i+size)); return r; }; const crmChunks = chunkArray(cleanCrm, 100); const seriesChunks = chunkArray(cleanSeries, 100); const promosChunks = chunkArray(cleanPromos, 100); const offersChunks = chunkArray(cleanOffers, 100); const incidentsChunks = chunkArray(cleanIncidents, 100); const merskaChunks = chunkArray(cleanMerska, 100); const chunksRef = collection(db, 'data_chunks'); const writeAllChunks = async (chunks, type) => { let batch = writeBatch(db); let count = 0; for (let i = 0; i < chunks.length; i++) { batch.set(doc(chunksRef, `${type.toLowerCase()}_chunk_${i}`), { type, index: i, data: chunks[i] }); count++; if (count >= 400) { await batch.commit(); batch = writeBatch(db); count = 0; } } if (count > 0) await batch.commit(); }; await writeAllChunks(crmChunks, 'CRM'); await writeAllChunks(seriesChunks, 'SERIES'); if (foundPromos) await writeAllChunks(promosChunks, 'PROMOS'); if (foundOffers) await writeAllChunks(offersChunks, 'OFFERS'); if (foundIncidents) await writeAllChunks(incidentsChunks, 'INCIDENTS'); if (foundMerska) await writeAllChunks(merskaChunks, 'MERSKA'); const now = new Date().toISOString(); const manifestRef = doc(db, 'data_chunks', 'manifest');await setDoc(manifestRef, { crmChunks: crmChunks.length, seriesChunks: seriesChunks.length, promosChunks: promosChunks.length, offersChunks: offersChunks.length, incidentsChunks: incidentsChunks.length, merskaChunks: merskaChunks.length, updatedAt: now }); alert("Datos subidos correctamente."); setReloadTrigger(prev => prev + 1); } else alert("No se encontraron hojas válidas."); } catch (e) { alert("Error al subir: " + e.message); } finally { setLoading(false); setIsUploadOpen(false); } }; reader.readAsArrayBuffer(file); };

  const handleDownloadVisitsExcel = () => { 
      if (!manualVisits || Object.keys(manualVisits).length === 0) { 
          alert("No hay nuevas visitas en la base de datos."); 
          return; 
      } 
      const rows = Object.entries(manualVisits).map(([id, v]) => ({ 
          "ID Registro": id, 
          "Código Cliente": v.nClient || "-", 
          "Cliente": v.clientName, 
          "Persona de Contacto": v.contact || "-",
          "Fecha": v.date, 
          "Series en Exposición": v.expo || "Ninguna", 
          "Nota": v.note, 
          "Promociones": v.promotions || "-"
      })); 
      if (window.XLSX) { 
          const ws = window.XLSX.utils.json_to_sheet(rows); 
          const wb = window.XLSX.utils.book_new(); 
          window.XLSX.utils.book_append_sheet(wb, ws, "Visitas"); 
          window.XLSX.writeFile(wb, `visitas_2026_export.xlsx`); 
      } 
  };

  const handleDownloadQuotesExcel = () => { if (!manualQuotes || Object.keys(manualQuotes).length === 0) { alert("No hay cotizaciones nuevas."); return; } const rows = Object.entries(manualQuotes).map(([id, q]) => ({ "ID": id, "Cliente": q.clientName, "Fecha": q.date, "Modelo": q.model, "Unidades": q.units, "Adicional": q.additional, "Estado": q.approved })); if (window.XLSX) { const ws = window.XLSX.utils.json_to_sheet(rows); const wb = window.XLSX.utils.book_new(); window.XLSX.utils.book_append_sheet(wb, ws, "Cotizaciones"); window.XLSX.writeFile(wb, `cotizaciones_export.xlsx`); } };
  const handleDeleteVisit = async (visitId) => { if (!user) return; try { await deleteDoc(doc(db, 'visits', visitId)); } catch (e) { console.error(e); } };
  const handleSaveVisit = async (newVisit) => { if (!user) return; try { await addDoc(collection(db, 'visits'), { ...newVisit, timestamp: new Date().toISOString() }); if (newVisit.contact) await addDoc(collection(db, 'client_updates'), { nClient: newVisit.nClient, contact: newVisit.contact }); alert("Visita guardada."); } catch (e) { console.error(e); } };
  const handleSaveQuote = async (newQuote) => { if (!user) return; try { await addDoc(collection(db, 'quotes'), { ...newQuote, timestamp: new Date().toISOString() }); alert("Cotización guardada."); } catch (e) { console.error(e); } };
  const handleRefresh = () => { setSyncStatus("loading"); setReloadTrigger(prev => prev + 1); };

  const renderContent = () => {
     if (syncStatus === 'empty' && rawCrmData.length === 0) return (<div className="flex flex-col items-center justify-center h-full min-h-[400px] text-gray-400 p-8"><div className="bg-white p-8 rounded-full shadow-sm mb-6 border border-gray-100"><Cloud className="w-16 h-16 text-blue-200" /></div><h2 className="text-2xl font-bold text-gray-700 mb-2">Esperando Datos (2026)</h2><p className="text-center max-w-md text-gray-500 mb-8">El administrador aún no ha cargado los datos.</p>{isAdmin && (<div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-sm text-orange-800 flex items-start gap-3 max-w-lg"><AlertTriangle className="w-5 h-5 shrink-0" /><div><strong>Aviso Admin:</strong> Carga el Excel <b>VT.xlsx</b>.</div></div>)}</div>);
     if (activeMode === 'HOME') return <HomeView data={crmData} seriesData={seriesData} merskaData={merskaData} />;
     if (activeMode === 'CLIENTE') return <SingleClientView customers={crmData} seriesData={seriesData} promosData={promosData} offersData={offersData} manualQuotes={manualQuotes} incidentsData={incidentsData} />;
     if (activeMode === 'AGENTE') return <AgentView data={crmData} seriesData={seriesData} promosData={promosData} merskaData={merskaData} />;
     if (activeMode === 'PROVINCIA') return <ProvinceView data={crmData} merskaData={merskaData} />;
     if (activeMode === 'GRUPO') return <GroupView data={crmData} />;
     if (activeMode === 'VISITA') return <VisitsView manualVisits={manualVisits} crmData={rawCrmData} onDelete={handleDeleteVisit} />; 
     if (activeMode === 'COMPARATIVA') return <ComparativaView data={crmData} promosData={promosData} merskaData={merskaData} seriesData={seriesData} />; 
     if (activeMode === 'SERIES') return <SeriesRankingView seriesData={seriesData} data={crmData} />; 
     if (activeMode === 'MODULAR') return <CustomRankingView data={crmData} mode="MODULAR" seriesData={seriesData} />;
     if (activeMode === 'TUYO') return <CustomRankingView data={crmData} mode="TUYO" seriesData={seriesData} />;
     if (activeMode === 'PROMOS') return <PromosRankingView promosData={promosData} />;
     return null;
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-gray-800 overflow-hidden relative">
        {showAdminLogin && (<div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in-up"><div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm"><div className="text-center mb-6"><div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"><Shield className="w-8 h-8 text-blue-600" /></div><h3 className="text-xl font-bold text-gray-800">Acceso Administrador</h3></div><form onSubmit={handleAdminSubmit}><div className="mb-4"><input type="password" className={`w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all ${loginError ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'}`} placeholder="Contraseña..." value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} autoFocus />{loginError && <p className="text-xs text-red-500 mt-2 font-medium">Contraseña incorrecta</p>}</div><div className="flex gap-3"><button type="button" onClick={() => { setShowAdminLogin(false); setLoginError(false); setAdminPassword(""); }} className="flex-1 py-3 text-gray-500 hover:bg-gray-100 rounded-xl font-bold transition-colors">Cancelar</button><button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">Entrar</button></div></form></div></div>)}
        <Sidebar activeMode={activeMode} setMode={setActiveMode} isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} lastUpdated={lastUpdated} />
        <NewVisitModal isOpen={isNewVisitOpen} onClose={() => setIsNewVisitOpen(false)} clients={crmData} onSave={handleSaveVisit} />
        <NewQuoteModal isOpen={isNewQuoteOpen} onClose={() => setIsNewQuoteOpen(false)} clients={crmData} onSave={handleSaveQuote} />
        <div className="flex-1 flex flex-col md:pl-64 h-full overflow-hidden transition-all duration-300">
            <div className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 flex justify-between items-center shadow-sm z-10 sticky top-0">
                 <div className="flex items-center gap-3"><button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg"><Menu className="w-6 h-6" /></button><div><div className="flex items-center gap-2"><h2 className="text-lg md:text-xl font-bold text-gray-800 truncate max-w-[200px] md:max-w-none">{activeMode === 'HOME' && 'Resumen General 2026'}{activeMode === 'CLIENTE' && 'Ficha de Cliente'}{activeMode === 'AGENTE' && 'Análisis por Agente'}{activeMode === 'PROVINCIA' && 'Análisis Geográfico'}{activeMode === 'GRUPO' && 'Análisis por Grupos'}{activeMode === 'VISITA' && 'Seguimiento de Visitas'}{activeMode === 'COMPARATIVA' && 'Comparativa de Agentes'}{activeMode === 'SERIES' && 'Ranking Productos'}{activeMode === 'MODULAR' && 'Ranking Gama Modular'}{activeMode === 'TUYO' && 'Ranking Serie Tuyo'}{activeMode === 'PROMOS' && 'Ranking Promociones 2026'}</h2>{syncStatus === 'loading' && <span className="text-xs flex items-center gap-1 text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100"><Loader2 className="w-3 h-3 animate-spin"/> Cargando...</span>}{syncStatus === 'synced' && <span className="text-xs flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100"><CheckCircle className="w-3 h-3"/> Sincronizado</span>}</div><div className="flex items-center gap-3"><p className="text-xs text-gray-500 hidden md:block mt-1">{crmData.length > 0 ? `Base de Datos: ${crmData.length} Clientes` : "Esperando datos..."}</p><button onClick={handleAdminToggle} className={`flex items-center gap-2 px-3 py-2 border rounded-lg transition-colors font-bold text-sm ${isAdmin ? 'text-orange-600 border-orange-200 bg-orange-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`} title={isAdmin ? "Cerrar modo administrador" : "Acceso Administrador"}>{isAdmin ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}<span className="hidden sm:inline">{isAdmin ? "Soy Admin" : "Soy Admin"}</span></button></div></div></div>
                 <div className="flex gap-2">
                    <button onClick={handleRefresh} className="p-2 border rounded-lg hover:bg-gray-50 text-gray-500" title="Refrescar"><RefreshCw className="w-4 h-4" /></button>
                    {isAdmin && (
                        <>
                            <button onClick={handleDownloadVisitsExcel} className="hidden lg:flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm shadow-md" title="Descargar Visitas"><FileText className="w-4 h-4" /> Visitas</button>
                            <button onClick={handleDownloadQuotesExcel} className="hidden lg:flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm shadow-md" title="Descargar Cotizaciones"><FilePlus className="w-4 h-4" /> Ofertas</button>
                            <button onClick={() => setIsUploadOpen(!isUploadOpen)} className={`flex items-center gap-2 px-3 py-2 md:px-4 border rounded-lg text-sm ${isUploadOpen ? 'bg-blue-50 text-blue-700' : 'bg-white hover:bg-gray-50'}`}><Upload className="w-4 h-4" /> <span className="hidden md:inline">{isUploadOpen ? 'Cerrar' : 'Cargar Excel'}</span></button>
                        </>
                    )}
                    <button onClick={() => setIsNewQuoteOpen(true)} className="hidden md:flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm shadow-md"><FilePlus className="w-4 h-4" /> <span className="hidden sm:inline">Nueva Oferta</span></button>
                    <button onClick={() => setIsNewVisitOpen(true)} className="hidden md:flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm shadow-md"><PlusCircle className="w-4 h-4" /> <span className="hidden sm:inline">Nueva Visita</span></button>
                 </div>
            </div>
            {isAdmin && isUploadOpen && (<div className="bg-blue-50 border-b border-blue-100 p-4 md:p-6 animate-fade-in-down"><div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-6 items-center"><div className="flex-1 w-full text-center md:text-left"><h4 className="font-bold text-blue-900 text-lg flex items-center justify-center md:justify-start gap-2"><FileText className="w-5 h-5" /> Actualizar Datos</h4><p className="text-sm text-blue-700 mt-1">Sube el archivo <strong>VT.xlsx</strong> completo.</p></div><div className="flex-1 w-full"><label className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${loading ? 'bg-gray-50' : 'bg-white hover:bg-blue-100'}`}><div className="flex flex-col items-center justify-center pt-2 pb-3">{loading ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div> : <><Upload className="w-6 h-6 mb-2 text-blue-500" /><p className="text-xs text-gray-500">Clic para subir .xlsx</p></>}</div><input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleExcelUpload} disabled={loading} /></label></div></div></div>)}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50"><div className="max-w-7xl mx-auto">{renderContent()}</div></div>
            <div className="md:hidden fixed bottom-6 right-6 flex flex-col gap-3 z-50">
                <button onClick={() => setIsNewQuoteOpen(true)} className="bg-purple-600 text-white p-4 rounded-full shadow-2xl hover:bg-purple-700 transition-transform active:scale-95 flex items-center justify-center" style={{ boxShadow: '0 4px 14px 0 rgba(147, 51, 234, 0.39)' }}><FilePlus className="w-6 h-6" /></button>
                <button onClick={() => setIsNewVisitOpen(true)} className="bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-transform active:scale-95 flex items-center justify-center" style={{ boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.39)' }}><PlusCircle className="w-6 h-6" /></button>
            </div>
        </div>
    </div>
  );

}
