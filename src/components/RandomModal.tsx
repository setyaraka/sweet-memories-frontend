import Modal from "./Modal";
import { Email } from "../lib/types";

type Props = {
    active?: Email,
    text: string,
    showRandom: boolean,
    setShowRandom: (value: boolean) => void
}

export default function RandomModal({ active, text, showRandom, setShowRandom }: Props){

    const displayText = text.replace(/\\n/g, "\n") ?? "";
    return (
        <Modal 
          open={showRandom} 
          onClose={() => setShowRandom(false)}
          labelledBy="modal-title"
        >
          {active ? (
          <div className="relative">
            <button 
              className="absolute -top-1 -right-1 w-8 h-8 flex items-center justify-center rounded-full hover:bg-orange-100 transition-colors text-gray-400 hover:text-gray-600"
              onClick={() => setShowRandom(false)}
              aria-label="Tutup"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="mb-4 pb-3 border-b border-orange-200/50">
              <div className="text-sm text-orange-700/70 font-medium mb-1">
                {new Date(active.created_at).toLocaleDateString("id-ID", { 
                  day: "2-digit", 
                  month: "long", 
                  year: "numeric" 
                })}
              </div>
              
              <h2 
                id="modal-title" 
                className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight [text-wrap:balance] pr-6"
              >
                {active.title}
              </h2>
            </div>
            <div className="space-y-4">
              <div className="prose prose-gray prose-sm sm:prose-base max-w-none">
                <span className="whitespace-pre-wrap text-gray-700 leading-relaxed mb-3 last:mb-0">
                    {displayText}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Tidak ada surat</p>
          </div>
        )}
      </Modal>
    )
}