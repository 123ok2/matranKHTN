import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Trash2, Download, Undo, FileText, Redo, Wand2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const LEVELS = ['biet', 'hieu', 'vd'] as const;
type Level = typeof LEVELS[number];

type LevelData = { tn: number | ''; ds: number | ''; tl: number | '' };

type ContentRow = {
  id: string;
  ten: string;
  biet: LevelData;
  hieu: LevelData;
  vd: LevelData;
};

type Topic = {
  id: string;
  chuDe: string;
  noiDung: ContentRow[];
};

const defaultLevelData = (): LevelData => ({ tn: '', ds: '', tl: '' });
const generateId = () => Math.random().toString(36).substring(2, 9);

const NumberInput = ({ value, onChange }: { value: number | ''; onChange: (val: number | '') => void }) => (
  <input
    type="text"
    inputMode="numeric"
    value={value}
    onChange={(e) => {
      const valStr = e.target.value.replace(/[^0-9]/g, '');
      onChange(valStr === '' ? '' : Number(valStr));
    }}
    onFocus={(e) => e.target.select()}
    className="w-full text-center bg-transparent border-none focus:ring-1 focus:ring-blue-500 rounded outline-none h-8"
  />
);

const DsInput = ({ value, onChange }: { value: number | ''; onChange: (val: number | '') => void }) => {
  const [focused, setFocused] = useState(false);
  const displayValue = focused ? value : (value ? `${value}/4` : '');
  
  return (
    <input
      type="text"
      inputMode="numeric"
      value={displayValue}
      onFocus={(e) => {
        setFocused(true);
        setTimeout(() => e.target.select(), 0);
      }}
      onBlur={() => setFocused(false)}
      onChange={(e) => {
         const valStr = e.target.value.replace(/[^0-9]/g, '');
         if (valStr === '') {
           onChange('');
           return;
         }
         const val = parseInt(valStr, 10);
         onChange(val > 4 ? 4 : val);
      }}
      className="w-full text-center bg-transparent border-none focus:ring-1 focus:ring-blue-500 rounded outline-none h-8"
    />
  );
};

const SmartTarget = ({
  value,
  actual,
  onChange,
  isPct = false,
  colSpan = 1,
}: {
  value: string;
  actual: number;
  onChange: (val: string) => void;
  isPct?: boolean;
  colSpan?: number;
}) => {
  const numValue = value === '' ? NaN : parseFloat(value.toString().replace(/,/g, '.'));
  const isMatch = value === '' || (!isNaN(numValue) && Math.abs(numValue - (actual || 0)) < 0.05);

  return (
    <td colSpan={colSpan} className={`border border-black p-0 relative group min-w-[32px] ${!isMatch && value !== '' ? 'bg-red-50 print:bg-transparent' : ''}`}>
      <input
        className={`w-full h-full min-h-[32px] text-center bg-transparent border-none outline-none focus:ring-inset focus:ring-2 focus:ring-blue-500 p-1 font-bold ${!isMatch && value !== '' ? 'text-red-600 print:text-black' : 'text-black'}`}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder=""
      />
      {!isMatch && value !== '' && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[11px] px-2 py-1 rounded hidden group-hover:block whitespace-nowrap z-50 shadow-lg pointer-events-none hide-on-print">
          Thực tế: {(actual || 0) % 1 !== 0 ? (actual || 0).toFixed(2) : (actual || 0)}{isPct ? '%' : ''}
        </div>
      )}
    </td>
  );
};

export default function App() {
  const [targetQs, setTargetQs] = useState({
    tn_biet: '8', tn_hieu: '4', tn_vd: '8',
    ds_biet: '1', ds_hieu: '1', ds_vd: '',
    tl_biet: '1', tl_hieu: '1', tl_vd: '1',
    sum_biet: '10', sum_hieu: '6', sum_vd: '9', sum_total: '25'
  });
  const [targetPts, setTargetPts] = useState({
    tn: '5', ds: '2', tl: '3',
    sum_biet: '4', sum_hieu: '3', sum_vd: '3', sum_total: '10'
  });
  const [targetRatio, setTargetRatio] = useState({
    tn: '50%', ds: '20%', tl: '30%',
    sum_biet: '40%', sum_hieu: '30%', sum_vd: '30%', sum_total: '100%'
  });

  const updateTargetQs = (key: keyof typeof targetQs, val: string) => setTargetQs(prev => ({ ...prev, [key]: val }));
  const updateTargetPts = (key: keyof typeof targetPts, val: string) => setTargetPts(prev => ({ ...prev, [key]: val }));
  const updateTargetRatio = (key: keyof typeof targetRatio, val: string) => setTargetRatio(prev => ({ ...prev, [key]: val }));

  const [topics, setTopics] = useState<Topic[]>([
    {
      id: generateId(),
      chuDe: 'Chủ đề 1: Ánh sáng',
      noiDung: [
        { id: generateId(), ten: 'Khúc xạ ánh sáng', biet: { tn: 2, ds: 1, tl: '' }, hieu: defaultLevelData(), vd: defaultLevelData() },
        { id: generateId(), ten: 'Phản xạ toàn phần', biet: { tn: 2, ds: 1, tl: '' }, hieu: defaultLevelData(), vd: defaultLevelData() },
        { id: generateId(), ten: 'Lăng kính', biet: { tn: 1, ds: '', tl: '' }, hieu: { tn: 1, ds: 1, tl: '' }, vd: { tn: 1, ds: '', tl: '' } },
        { id: generateId(), ten: 'Thấu kính', biet: { tn: 1, ds: '', tl: '' }, hieu: { tn: 1, ds: 1, tl: '' }, vd: { tn: 1, ds: '', tl: 1 } },
        { id: generateId(), ten: 'Kính lúp', biet: defaultLevelData(), hieu: { tn: 1, ds: '', tl: '' }, vd: { tn: 1, ds: '', tl: '' } },
      ]
    },
    {
      id: generateId(),
      chuDe: 'Chủ đề 2: Cơ chế Di truyền và Biến dị',
      noiDung: [
        { id: generateId(), ten: 'Tái bản DNA và phiên mã tạo RNA', biet: { tn: '', ds: 1, tl: '' }, hieu: defaultLevelData(), vd: { tn: 1, ds: '', tl: '' } },
        { id: generateId(), ten: 'Dịch mã và mối quan hệ từ gene đến tính trạng', biet: { tn: '', ds: 1, tl: '' }, hieu: defaultLevelData(), vd: defaultLevelData() },
        { id: generateId(), ten: 'Đột biến Gene', biet: defaultLevelData(), hieu: { tn: 1, ds: 1, tl: 1 }, vd: defaultLevelData() },
        { id: generateId(), ten: 'Nhiễm sắc thể và bộ nhiễm sắc thể', biet: defaultLevelData(), hieu: { tn: '', ds: 1, tl: '' }, vd: defaultLevelData() },
      ]
    },
    {
      id: generateId(),
      chuDe: 'Chủ đề 3: Phi kim - Kim loại và Mở đầu Hóa hữu cơ',
      noiDung: [
        { id: generateId(), ten: 'Sự khác nhau cơ bản giữa phi kim và kim loại', biet: { tn: 1, ds: '', tl: 1 }, hieu: defaultLevelData(), vd: { tn: 2, ds: '', tl: '' } },
        { id: generateId(), ten: 'Giới thiệu về hợp chất hữu cơ', biet: { tn: 1, ds: '', tl: '' }, hieu: defaultLevelData(), vd: { tn: 2, ds: '', tl: '' } },
      ]
    }
  ]);

  const [past, setPast] = useState<Topic[][]>([]);
  const [future, setFuture] = useState<Topic[][]>([]);

  const setTopicsWithHistory = (newTopics: Topic[]) => {
    setPast((prev) => [...prev, JSON.parse(JSON.stringify(topics))]);
    setFuture([]);
    setTopics(newTopics);
  };

  const undo = () => {
    if (past.length > 0) {
      const previous = past[past.length - 1];
      setPast((prev) => prev.slice(0, -1));
      setFuture((prev) => [JSON.parse(JSON.stringify(topics)), ...prev]);
      setTopics(previous);
    }
  };

  const redo = () => {
    if (future.length > 0) {
      const next = future[0];
      setFuture((prev) => prev.slice(1));
      setPast((prev) => [...prev, JSON.parse(JSON.stringify(topics))]);
      setTopics(next);
    }
  };

  const addTopic = () => {
    setTopicsWithHistory([...JSON.parse(JSON.stringify(topics)), {
      id: generateId(),
      chuDe: `Chủ đề ${topics.length + 1}`,
      noiDung: [{ id: generateId(), ten: 'Nội dung mới', biet: defaultLevelData(), hieu: defaultLevelData(), vd: defaultLevelData() }]
    }]);
  };

  const addContent = (tIdx: number) => {
    const newTopics = JSON.parse(JSON.stringify(topics));
    newTopics[tIdx].noiDung.push({ id: generateId(), ten: 'Nội dung mới', biet: defaultLevelData(), hieu: defaultLevelData(), vd: defaultLevelData() });
    setTopicsWithHistory(newTopics);
  };

  const updateTopic = (tIdx: number, val: string) => {
    const newTopics = JSON.parse(JSON.stringify(topics));
    newTopics[tIdx].chuDe = val;
    setTopicsWithHistory(newTopics);
  };

  const updateContent = (tIdx: number, cIdx: number, val: string) => {
    const newTopics = JSON.parse(JSON.stringify(topics));
    newTopics[tIdx].noiDung[cIdx].ten = val;
    setTopicsWithHistory(newTopics);
  };

  const updateMetric = (tIdx: number, cIdx: number, level: Level, type: 'tn'|'ds'|'tl', val: number | '') => {
    const newTopics = JSON.parse(JSON.stringify(topics));
    newTopics[tIdx].noiDung[cIdx][level][type] = val;
    setTopicsWithHistory(newTopics);
  };

  const removeTopic = (tIdx: number) => {
    setTopicsWithHistory(topics.filter((_, i) => i !== tIdx));
  };

  const removeContent = (tIdx: number, cIdx: number) => {
    const newTopics = JSON.parse(JSON.stringify(topics));
    newTopics[tIdx].noiDung.splice(cIdx, 1);
    setTopicsWithHistory(newTopics);
  };

  const clearAllData = () => {
    if (window.confirm('Bạn có chắc chắn muốn làm mới toàn bộ dữ liệu? (Có thể dùng nút Hoàn tác nếu lỡ tay)')) {
      setTopicsWithHistory([
        {
          id: generateId(),
          chuDe: 'Chủ đề 1',
          noiDung: [{ id: generateId(), ten: 'Nội dung 1', biet: defaultLevelData(), hieu: defaultLevelData(), vd: defaultLevelData() }]
        }
      ]);
    }
  };

  const [isAILoading, setIsAILoading] = useState(false);

  const autoAllocateData = async () => {
    setIsAILoading(true);
    // Simulate slight delay for UI feedback
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      const newTopics = JSON.parse(JSON.stringify(topics));
      let allContents = newTopics.flatMap((t: any) => t.noiDung);
      const N = allContents.length;
      
      if (N === 0) {
         alert("Vui lòng thêm ít nhất một nội dung để phân bổ.");
         setIsAILoading(false);
         return;
      }

      // Reset all contents to empty BEFORE allocating
      allContents.forEach((c: any) => {
        c.biet = { tn: "", ds: "", tl: "" };
        c.hieu = { tn: "", ds: "", tl: "" };
        c.vd = { tn: "", ds: "", tl: "" };
      });

      const distribute = (type: 'tn' | 'ds' | 'tl', level: Level) => {
        const rawTarget = parseInt(targetQs[`${type}_${level}`] as string) || 0;
        const target = type === 'ds' ? rawTarget * 4 : rawTarget;
        
        if (target <= 0) return;

        let indices = Array.from({length: N}, (_, i) => i);
        // Shuffle indices using Fisher-Yates
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }

        const base = Math.floor(target / N);
        const remainder = target % N;

        for (let i = 0; i < N; i++) {
          const count = base + (i < remainder ? 1 : 0);
          if (count > 0) {
             const contentIndex = indices[i];
             allContents[contentIndex][level][type] = count.toString();
          }
        }
      };

      LEVELS.forEach(level => {
        ['tn', 'ds', 'tl'].forEach(type => {
          distribute(type as any, level);
        });
      });

      setTopicsWithHistory(newTopics);
    } catch (err: any) {
      console.error(err);
      alert("Lỗi khi tự phân bổ: " + (err.message || "Vui lòng thử lại."));
    } finally {
      setIsAILoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [past, future, topics]);

  const exportToWord = () => {
    const table = document.getElementById("matrix-table");
    if (!table) return;

    const clone = table.cloneNode(true) as HTMLTableElement;
    const hideElements = clone.querySelectorAll('.hide-on-print');
    hideElements.forEach(el => el.parentNode?.removeChild(el));

    const originalInputs = table.querySelectorAll('input, textarea');
    const clonedInputs = clone.querySelectorAll('input, textarea');

    originalInputs.forEach((original: any, index) => {
      if (clonedInputs[index]) {
        const cell = clonedInputs[index].parentNode;
        if (cell) cell.textContent = original.value || original.innerText;
      }
    });

    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>Ma trận</title>
        <style>
          @page WordSection1 {
            size: 297mm 210mm; /* A4 Landscape */
            mso-page-orientation: landscape;
            margin: 1.5cm 1.5cm 1.5cm 1.5cm;
          }
          div.WordSection1 { page: WordSection1; }
          table { width: 100%; border-collapse: collapse; font-family: 'Times New Roman', serif; font-size: 11pt; }
          th, td { border: 1px solid black; padding: 4px; }
        </style>
      </head>
      <body>
        <div class="WordSection1">
          <h2 style="text-align: center; font-family: 'Times New Roman', serif;">MA TRẬN ĐỀ KIỂM TRA</h2>
          ${clone.outerHTML}
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', html], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'MaTranDeKiemTra.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Calculations
  const getTn = (c: ContentRow, lvl: Level) => Number(c[lvl].tn) || 0;
  const getDs = (c: ContentRow, lvl: Level) => Number(c[lvl].ds) || 0;
  const getTl = (c: ContentRow, lvl: Level) => Number(c[lvl].tl) || 0;

  const contentQs = (c: ContentRow, lvl: Level) => getTn(c,lvl) + getDs(c,lvl)/4 + getTl(c,lvl);
  const contentPts = (c: ContentRow, lvl: Level) => getTn(c,lvl)*0.25 + getDs(c,lvl)*0.25 + getTl(c,lvl)*1.0;
  
  const contentTotalQs = (c: ContentRow) => LEVELS.reduce((sum, lvl) => sum + contentQs(c,lvl), 0);
  const contentTotalPts = (c: ContentRow) => LEVELS.reduce((sum, lvl) => sum + contentPts(c,lvl), 0);

  const sums = useMemo(() => {
    const s = {
      tn: { biet: 0, hieu: 0, vd: 0 },
      ds: { biet: 0, hieu: 0, vd: 0 },
      tl: { biet: 0, hieu: 0, vd: 0 },
      sumQs: { biet: 0, hieu: 0, vd: 0 },
      sumPts: { biet: 0, hieu: 0, vd: 0 },
      ptsFn: { tn: 0, ds: 0, tl: 0 },
      totalQs: 0,
      totalPts: 0
    };

    topics.forEach(t => t.noiDung.forEach(c => {
      LEVELS.forEach(lvl => {
        s.tn[lvl] += getTn(c, lvl);
        s.ds[lvl] += getDs(c, lvl);
        s.tl[lvl] += getTl(c, lvl);
        s.sumQs[lvl] += contentQs(c, lvl);
        s.sumPts[lvl] += contentPts(c, lvl);
        
        s.ptsFn.tn += getTn(c, lvl) * 0.25;
        s.ptsFn.ds += getDs(c, lvl) * 0.25;
        s.ptsFn.tl += getTl(c, lvl) * 1.0;
      });
      s.totalQs += contentTotalQs(c);
      s.totalPts += contentTotalPts(c);
    }));

    // Rounding totalDs to questions for total (4 ý = 1 câu). The image says e.g. "1" for 4 ý
    return s;
  }, [topics]);

  const fmt = (n: number) => (n === 0 ? '' : (n % 1 !== 0 ? n.toFixed(2) : n));
  const fmtZero = (n: number) => (n === 0 ? '0' : (n % 1 !== 0 ? n.toFixed(2) : n));

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
      <div className="max-w-[1400px] mx-auto bg-white shadow-lg overflow-hidden border">
        
        {/* Header / Actions */}
        <div className="p-4 border-b flex flex-wrap gap-4 justify-between items-center hide-on-print bg-gray-50">
          <h1 className="text-xl font-bold">Ma trận Đề kiểm tra</h1>
          <div className="flex flex-wrap gap-2">
            <Button onClick={autoAllocateData} disabled={isAILoading} className="bg-purple-600 hover:bg-purple-700 text-white">
              {isAILoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <Wand2 className="w-4 h-4 mr-2"/>} 
              Tự động phân bổ
            </Button>
            <Button onClick={clearAllData} variant="destructive" className="bg-red-600 hover:bg-red-700 text-white">
              <Trash2 className="w-4 h-4 mr-2"/> Làm mới dữ liệu
            </Button>
            <Button onClick={undo} disabled={past.length === 0} variant="outline" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
              <Undo className="w-4 h-4 mr-2"/> Hoàn tác
            </Button>
            <Button onClick={redo} disabled={future.length === 0} variant="outline" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
              <Redo className="w-4 h-4 mr-2"/> Làm lại
            </Button>
            <Button onClick={addTopic} variant="outline"><Plus className="w-4 h-4 mr-2"/> Thêm Chủ đề</Button>
            <Button onClick={exportToWord} variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50">
              <FileText className="w-4 h-4 mr-2"/> Xuất Word
            </Button>
            <Button onClick={() => window.print()}><Download className="w-4 h-4 mr-2"/> Xuất PDF</Button>
          </div>
        </div>

        {/* Table */}
        <div className="p-4 overflow-x-auto print:p-0">
          <table id="matrix-table" className="w-full text-[13px] border-collapse bg-white border border-black print:text-[11px]" border={1}>
            <thead>
              <tr className="bg-gray-100">
                <th rowSpan={4} className="border border-black p-2 w-10 text-center align-middle font-bold">TT</th>
                <th rowSpan={4} className="border border-black p-2 w-48 text-center align-middle font-bold">Chủ đề/Chương</th>
                <th rowSpan={4} className="border border-black p-2 min-w-[200px] text-center align-middle font-bold">Nội dung/Đơn vị kiến thức</th>
                <th colSpan={9} className="border border-black p-2 text-center font-bold">Mức độ đánh giá</th>
                <th colSpan={3} rowSpan={2} className="border border-black p-2 text-center align-middle font-bold">Tổng</th>
                <th rowSpan={4} className="border border-black p-2 w-16 text-center align-middle font-bold">Tỷ lệ<br/>%<br/>điểm</th>
                <th rowSpan={4} className="border border-black w-10 text-center align-middle font-bold hide-on-print">Xóa</th>
              </tr>
              <tr className="bg-gray-100">
                <th colSpan={6} className="border border-black p-2 text-center font-bold">Trắc nghiệm khách quan</th>
                <th colSpan={3} rowSpan={2} className="border border-black p-2 text-center align-middle font-bold">Tự luận</th>
              </tr>
              <tr className="bg-gray-100">
                <th colSpan={3} className="border border-black p-2 text-center font-bold">Nhiều lựa chọn</th>
                <th colSpan={3} className="border border-black p-2 text-center font-bold">Đúng/Sai</th>
                <th rowSpan={2} className="border border-black p-1 text-center w-12 font-bold">Biết</th>
                <th rowSpan={2} className="border border-black p-1 text-center w-12 font-bold">Hiểu</th>
                <th rowSpan={2} className="border border-black p-1 text-center w-12 font-bold">Vận<br/>dụng</th>
              </tr>
              <tr className="bg-gray-100">
                <th className="border border-black p-1 text-center w-10 font-bold">Biết</th>
                <th className="border border-black p-1 text-center w-10 font-bold">Hiểu</th>
                <th className="border border-black p-1 text-center w-10 font-bold">Vận<br/>dụng</th>
                <th className="border border-black p-1 text-center w-10 font-bold">Biết</th>
                <th className="border border-black p-1 text-center w-10 font-bold">Hiểu</th>
                <th className="border border-black p-1 text-center w-10 font-bold">Vận<br/>dụng</th>
                <th className="border border-black p-1 text-center w-10 font-bold">Biết</th>
                <th className="border border-black p-1 text-center w-10 font-bold">Hiểu</th>
                <th className="border border-black p-1 text-center w-10 font-bold">Vận<br/>dụng</th>
              </tr>
            </thead>
            <tbody>
              {topics.map((t, tIdx) => (
                <React.Fragment key={t.id}>
                  {t.noiDung.map((c, cIdx) => (
                    <tr key={c.id}>
                      {cIdx === 0 && (
                        <td rowSpan={t.noiDung.length} className="border border-black p-2 text-center align-middle">{tIdx + 1}</td>
                      )}
                      {cIdx === 0 && (
                        <td rowSpan={t.noiDung.length} className="border border-black align-middle">
                          <textarea 
                            className="w-full bg-transparent border-none outline-none resize-none px-2 focus:ring-1 focus:ring-blue-500 rounded"
                            rows={3}
                            value={t.chuDe}
                            onChange={(e) => updateTopic(tIdx, e.target.value)}
                          />
                        </td>
                      )}
                      <td className="border border-black">
                        <div className="flex">
                           <Input 
                            className="border-none bg-transparent shadow-none h-8 w-full rounded-none" 
                            value={c.ten} 
                            onChange={(e) => updateContent(tIdx, cIdx, e.target.value)}
                          />
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hide-on-print" onClick={() => removeContent(tIdx, cIdx)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                      
                      {/* TN */}
                      <td className="border border-black"><NumberInput value={c.biet.tn} onChange={(v) => updateMetric(tIdx, cIdx, 'biet', 'tn', v)} /></td>
                      <td className="border border-black"><NumberInput value={c.hieu.tn} onChange={(v) => updateMetric(tIdx, cIdx, 'hieu', 'tn', v)} /></td>
                      <td className="border border-black"><NumberInput value={c.vd.tn} onChange={(v) => updateMetric(tIdx, cIdx, 'vd', 'tn', v)} /></td>
                      
                      {/* DS */}
                      <td className="border border-black"><DsInput value={c.biet.ds} onChange={(v) => updateMetric(tIdx, cIdx, 'biet', 'ds', v)} /></td>
                      <td className="border border-black"><DsInput value={c.hieu.ds} onChange={(v) => updateMetric(tIdx, cIdx, 'hieu', 'ds', v)} /></td>
                      <td className="border border-black"><DsInput value={c.vd.ds} onChange={(v) => updateMetric(tIdx, cIdx, 'vd', 'ds', v)} /></td>
                      
                      {/* TL */}
                      <td className="border border-black"><NumberInput value={c.biet.tl} onChange={(v) => updateMetric(tIdx, cIdx, 'biet', 'tl', v)} /></td>
                      <td className="border border-black"><NumberInput value={c.hieu.tl} onChange={(v) => updateMetric(tIdx, cIdx, 'hieu', 'tl', v)} /></td>
                      <td className="border border-black"><NumberInput value={c.vd.tl} onChange={(v) => updateMetric(tIdx, cIdx, 'vd', 'tl', v)} /></td>
                      
                      {/* Tổng */}
                      <td className="border border-black text-center">{fmt(contentQs(c, 'biet'))}</td>
                      <td className="border border-black text-center">{fmt(contentQs(c, 'hieu'))}</td>
                      <td className="border border-black text-center">{fmt(contentQs(c, 'vd'))}</td>
                      
                      {/* Tỷ lệ % điểm (Points actually) */}
                      <td className="border border-black text-center">{fmt(contentTotalPts(c))}</td>
                      
                      {cIdx === 0 && (
                        <td rowSpan={t.noiDung.length} className="border border-black align-middle text-center hide-on-print bg-gray-50">
                          <Button variant="ghost" size="sm" onClick={() => addContent(tIdx)} className="text-[10px] h-6 px-1 border border-gray-300">
                            + Dòng
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => removeTopic(tIdx)} className="text-[10px] h-6 px-1 mt-2 text-red-500 border border-gray-300">
                            Xóa C.Đề
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}
                </React.Fragment>
              ))}

              {/* TỔNG SỐ CÂU */}
              <tr className="font-bold bg-gray-100">
                <td colSpan={3} className="border border-black p-2 text-center">Tổng số câu</td>
                <SmartTarget value={targetQs.tn_biet} actual={sums.tn.biet} onChange={v => updateTargetQs('tn_biet', v)} />
                <SmartTarget value={targetQs.tn_hieu} actual={sums.tn.hieu} onChange={v => updateTargetQs('tn_hieu', v)} />
                <SmartTarget value={targetQs.tn_vd} actual={sums.tn.vd} onChange={v => updateTargetQs('tn_vd', v)} />
                <SmartTarget value={targetQs.ds_biet} actual={sums.ds.biet / 4} onChange={v => updateTargetQs('ds_biet', v)} />
                <SmartTarget value={targetQs.ds_hieu} actual={sums.ds.hieu / 4} onChange={v => updateTargetQs('ds_hieu', v)} />
                <SmartTarget value={targetQs.ds_vd} actual={sums.ds.vd / 4} onChange={v => updateTargetQs('ds_vd', v)} />
                <SmartTarget value={targetQs.tl_biet} actual={sums.tl.biet} onChange={v => updateTargetQs('tl_biet', v)} />
                <SmartTarget value={targetQs.tl_hieu} actual={sums.tl.hieu} onChange={v => updateTargetQs('tl_hieu', v)} />
                <SmartTarget value={targetQs.tl_vd} actual={sums.tl.vd} onChange={v => updateTargetQs('tl_vd', v)} />
                <SmartTarget value={targetQs.sum_biet} actual={sums.sumQs.biet} onChange={v => updateTargetQs('sum_biet', v)} />
                <SmartTarget value={targetQs.sum_hieu} actual={sums.sumQs.hieu} onChange={v => updateTargetQs('sum_hieu', v)} />
                <SmartTarget value={targetQs.sum_vd} actual={sums.sumQs.vd} onChange={v => updateTargetQs('sum_vd', v)} />
                <SmartTarget value={targetQs.sum_total} actual={sums.totalQs} onChange={v => updateTargetQs('sum_total', v)} />
                <td className="border border-black hide-on-print"></td>
              </tr>
              
              {/* TỔNG SỐ ĐIỂM */}
              <tr className="font-bold bg-gray-100">
                <td colSpan={3} className="border border-black p-2 text-center">Tổng số điểm</td>
                <SmartTarget colSpan={3} value={targetPts.tn} actual={sums.ptsFn.tn} onChange={v => updateTargetPts('tn', v)} />
                <SmartTarget colSpan={3} value={targetPts.ds} actual={sums.ptsFn.ds} onChange={v => updateTargetPts('ds', v)} />
                <SmartTarget colSpan={3} value={targetPts.tl} actual={sums.ptsFn.tl} onChange={v => updateTargetPts('tl', v)} />
                <SmartTarget value={targetPts.sum_biet} actual={sums.sumPts.biet} onChange={v => updateTargetPts('sum_biet', v)} />
                <SmartTarget value={targetPts.sum_hieu} actual={sums.sumPts.hieu} onChange={v => updateTargetPts('sum_hieu', v)} />
                <SmartTarget value={targetPts.sum_vd} actual={sums.sumPts.vd} onChange={v => updateTargetPts('sum_vd', v)} />
                <SmartTarget value={targetPts.sum_total} actual={sums.totalPts} onChange={v => updateTargetPts('sum_total', v)} />
                <td className="border border-black hide-on-print"></td>
              </tr>
              
              {/* TỶ LỆ % */}
              <tr className="font-bold bg-gray-100">
                <td colSpan={3} className="border border-black p-2 text-center">Tỷ lệ %</td>
                <SmartTarget isPct colSpan={3} value={targetRatio.tn} actual={sums.totalPts ? (sums.ptsFn.tn / sums.totalPts) * 100 : 0} onChange={v => updateTargetRatio('tn', v)} />
                <SmartTarget isPct colSpan={3} value={targetRatio.ds} actual={sums.totalPts ? (sums.ptsFn.ds / sums.totalPts) * 100 : 0} onChange={v => updateTargetRatio('ds', v)} />
                <SmartTarget isPct colSpan={3} value={targetRatio.tl} actual={sums.totalPts ? (sums.ptsFn.tl / sums.totalPts) * 100 : 0} onChange={v => updateTargetRatio('tl', v)} />
                <SmartTarget isPct value={targetRatio.sum_biet} actual={sums.totalPts ? (sums.sumPts.biet / sums.totalPts) * 100 : 0} onChange={v => updateTargetRatio('sum_biet', v)} />
                <SmartTarget isPct value={targetRatio.sum_hieu} actual={sums.totalPts ? (sums.sumPts.hieu / sums.totalPts) * 100 : 0} onChange={v => updateTargetRatio('sum_hieu', v)} />
                <SmartTarget isPct value={targetRatio.sum_vd} actual={sums.totalPts ? (sums.sumPts.vd / sums.totalPts) * 100 : 0} onChange={v => updateTargetRatio('sum_vd', v)} />
                <SmartTarget isPct value={targetRatio.sum_total} actual={100} onChange={v => updateTargetRatio('sum_total', v)} />
                <td className="border border-black hide-on-print"></td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Footer */}
        <div className="p-4 text-center text-sm text-gray-500 hide-on-print border-t">
          Thiết kế bởi: Duy Hạnh - Zalo: 0868640898
        </div>
      </div>
      <style>{`
        @media print {
          body { background: white; padding: 0; }
          .hide-on-print { display: none !important; }
          .border-black { border-color: black !important; }
          table { width: 100%; }
        }
      `}</style>
    </div>
  );
}
