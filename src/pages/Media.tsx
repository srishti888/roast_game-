
// import React from 'react';
// import { Link } from 'react-router-dom';
// import WarBackground from '@/components/WarBackground';
// import { Shield, ChevronLeft } from 'lucide-react';

// const Media = () => {
//   return (
//     <WarBackground>
//       <div className="min-h-screen flex flex-col p-6">
//         <Link 
//           to="/" 
//           className="flex items-center text-war-gray hover:text-white transition-colors mb-8 self-start"
//         >
//           <ChevronLeft className="mr-1" /> Return to Base
//         </Link>
        
//         <div className="flex flex-col items-center justify-center flex-1">
//           <div className="war-card p-8 w-full max-w-2xl animate-fade-in">
//             <div className="flex items-center justify-center mb-6">
//               <Shield className="w-10 h-10 text-war-red mr-3" />
//               <h1 className="text-3xl font-bold uppercase tracking-wider text-white">Media Archives</h1>
//             </div>
            
//             <p className="text-war-gray text-center mb-8">
//               Access to classified war footage, combat records, and intelligence briefings.
//             </p>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {['Combat Footage', 'Weapon Showcase', 'Mission Briefings', 'Tactical Analysis'].map((item, index) => (
//                 <div 
//                   key={index} 
//                   className="bg-black/30 p-4 rounded border border-war-gray/30 hover:border-war-red/50 transition-colors cursor-pointer"
//                 >
//                   <p className="font-medium text-center">{item}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </WarBackground>
//   );
// };

// export default Media;



import HeadlineGame from '../components/HeadlineGame';

export default function Media() {
  return (
    <div>
      <HeadlineGame />
    </div>
  );
}
