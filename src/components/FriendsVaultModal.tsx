import React, { useState, useEffect } from 'react';
import {
  X,
  RefreshCw,
  Clock,
  BatteryCharging,
  Utensils,
  Brain,
  MessageCircle,
  Copy,
  Check,
  Trash2,
  Lock,
  Sparkles,
} from 'lucide-react';
import { StoredReport } from '../types';
import { deleteLocalReport, getLocalReports } from '../utils/reports';
import { sound } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';
import { MoodHistoryChart } from './MoodHistoryChart';

interface FriendsVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FriendsVaultModal: React.FC<FriendsVaultModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [reports, setReports] = useState<StoredReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      setReports(getLocalReports() as StoredReport[]);
    } catch (err) {
      console.error('Failed to load local reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchReports();
  }, [isOpen]);

  const handleDelete = (id: string) => {
    triggerHaptic(15);
    deleteLocalReport(id);
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  const handleCopyReport = (report: StoredReport) => {
    sound.playPop();
    triggerHaptic(10);
    const text = `📋 TEJASWI SUBMISSION REPORT (${new Date(report.timestamp).toLocaleString()}):
• Mood: ${report.selectedMood?.emoji || ''} ${report.selectedMood?.title || 'Unknown'}
• Social Battery: ${(report.batteryLevel || 5) * 10}%
• Overthinking Index: ${report.overthinkingLevel || 5}/10
• Comfort Craving: ${report.selectedCraving?.emoji || ''} ${report.selectedCraving?.label || 'None'}
• Headspace: "${report.selectedSituation?.title || 'None'}"
• Support Style Wanted: "${report.selectedSupport?.title || 'None'}"
• "Do You Hate Me?" Answer: "${report.hateAnswer || 'No'}" (${report.noDodgeCount || 0} evasions)
• Problem Category: ${report.problemCategory || 'None'}
• Real Problem Shared: "${report.customProblemText || 'None'}"
• Her Note to You: "${report.specialNoteToFriend || 'No note written'}"`;

    navigator.clipboard.writeText(text);
    setCopiedId(report.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg max-h-[85vh] bg-slate-900 border border-slate-800 rounded-[32px] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-outfit font-bold text-base text-slate-100 flex items-center gap-1.5">
                This Browser's Insights Vault
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/60">
                  Local Only
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Check-ins saved on this device only.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={fetchReports}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          {loading ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              <RefreshCw className="w-5 h-5 mx-auto mb-2 animate-spin text-purple-400" />
              <span>Loading saved check-ins...</span>
            </div>
          ) : reports.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs space-y-1">
              <p className="font-semibold text-slate-300">No reports recorded yet.</p>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Check-ins saved in this browser will appear here. They are not uploaded or shared.
              </p>
            </div>
          ) : (
            <>
              {/* Mood History Visual Section */}
              <MoodHistoryChart reports={reports} />

              {/* Individual Session Submissions Header */}
              <div className="pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="font-outfit font-bold text-xs text-slate-200">
                    Session Records ({reports.length})
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Latest check-ins
                  </span>
                </div>

                <div className="space-y-3">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs shadow-md"
                    >
                {/* Meta bar */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-850 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-purple-400" />
                      {new Date(report.timestamp).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {report.planFinalized && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[9px] font-bold text-emerald-300 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                        <span>Finalized</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopyReport(report)}
                      className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === report.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-[10px]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span className="text-[10px]">Copy</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(report.id)}
                      className="p-1 rounded-lg hover:bg-rose-950/60 text-slate-500 hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Main Diagnostics Grid */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 bg-slate-900 rounded-xl">
                    <span className="text-slate-500 block text-[9px] uppercase">Registered Mood</span>
                    <span className="font-bold text-slate-200">
                      {report.selectedMood?.emoji} {report.selectedMood?.title || 'Not specified'}
                    </span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-xl">
                    <span className="text-slate-500 block text-[9px] uppercase">Social Battery</span>
                    <span className="font-bold text-rose-400 flex items-center gap-1">
                      <BatteryCharging className="w-3 h-3" />
                      {(report.batteryLevel || 5) * 10}%
                    </span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-xl">
                    <span className="text-slate-500 block text-[9px] uppercase">Emergency Craving</span>
                    <span className="font-bold text-amber-400">
                      {report.selectedCraving?.emoji} {report.selectedCraving?.label || 'None'}
                    </span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-xl">
                    <span className="text-slate-500 block text-[9px] uppercase">Overthinking Level</span>
                    <span className="font-bold text-purple-400 flex items-center gap-1">
                      <Brain className="w-3 h-3" />
                      {report.overthinkingLevel || 5} / 10
                    </span>
                  </div>
                </div>

                {/* Headspace & Support wanted */}
                <div className="p-2.5 bg-slate-900/90 rounded-xl space-y-1">
                  <div className="text-[11px] text-slate-300">
                    <strong className="text-purple-400">What's on her mind:</strong> "{report.selectedSituation?.title || 'Standard'}"
                  </div>
                  <div className="text-[11px] text-slate-300">
                    <strong className="text-rose-400">Support she wants:</strong> "{report.selectedSupport?.title || 'Listening'}"
                  </div>
                  <div className="text-[11px] text-slate-400">
                    <strong className="text-emerald-400">"Do you hate me?":</strong> "{report.hateAnswer || 'No'}" ({report.noDodgeCount || 0} evasions)
                  </div>
                </div>

                {/* Custom Problem Shared */}
                {report.customProblemText && (
                  <div className="p-2.5 bg-amber-950/30 border border-amber-500/30 rounded-xl text-xs text-amber-200">
                    <span className="font-bold block text-[10px] uppercase text-amber-400 mb-0.5">
                      Her Personal Problem Shared ({report.problemCategory || 'General'}):
                    </span>
                    "{report.customProblemText}"
                  </div>
                )}

                {/* Personal Note for Him */}
                {report.specialNoteToFriend && (
                  <div className="p-2.5 bg-rose-950/30 border border-rose-500/30 rounded-xl text-xs text-rose-200">
                    <span className="font-bold block text-[10px] uppercase text-rose-400 mb-0.5 flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      Her Note to You:
                    </span>
                    "{report.specialNoteToFriend}"
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </>
    )}
  </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-500 text-center">
          Saved in this browser only · Clearing browser data will erase these entries.
        </div>
      </div>
    </div>
  );
};
