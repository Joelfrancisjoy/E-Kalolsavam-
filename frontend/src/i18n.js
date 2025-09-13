import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          "welcome": "Welcome",
          "dashboard": "Dashboard",
          "student_dashboard": "Student Dashboard",
          "judge_dashboard": "Judge Dashboard",
          "admin_panel": "Admin Panel",
          "volunteer_dashboard": "Volunteer Dashboard",
          "live_results": "Live Results",
          "events": "Events",
          "schedule": "Schedule",
          "registered_events": "Registered Events",
          "qr_id_card": "QR ID Card",
          "results": "Results",
          "feedback": "Feedback",
          "assigned_events": "Assigned Events",
          "scoring_panel": "Scoring Panel",
          "user_management": "User Management",
          "event_management": "Event Management",
          "result_publishing": "Result Publishing",
          "certificate_generation": "Certificate Generation",
          "volunteer_coordination": "Volunteer Coordination",
          "shift_allocation": "Shift Allocation",
          "instructions": "Instructions",
          "login": "Login",
          "logout": "Logout",
          "language": "Language",
          "english": "English",
          "malayalam": "Malayalam"
        }
      },
      ml: {
        translation: {
          "welcome": "സ്വാഗതം",
          "dashboard": "ഡാഷ്ബോർഡ്",
          "student_dashboard": "വിദ്യാർത്ഥി ഡാഷ്ബോർഡ്",
          "judge_dashboard": "ന്യായാധിപൻ ഡാഷ്ബോർഡ്",
          "admin_panel": "അഡ്മിൻ പാനൽ",
          "volunteer_dashboard": "വൊളന്റീയർ ഡാഷ്ബോർഡ്",
          "live_results": "തത്സമയ ഫലങ്ങൾ",
          "events": "പരിപാടികൾ",
          "schedule": "ഷെഡ്യൂൾ",
          "registered_events": "രജിസ്റ്റർ ചെയ്ത പരിപാടികൾ",
          "qr_id_card": "QR ഐഡി കാർഡ്",
          "results": "ഫലങ്ങൾ",
          "feedback": "പ്രതികരണം",
          "assigned_events": "നിയുക്ത പരിപാടികൾ",
          "scoring_panel": "സ്കോറിംഗ് പാനൽ",
          "user_management": "ഉപയോക്തൃ മാനേജ്മെന്റ്",
          "event_management": "പരിപാടി മാനേജ്മെന്റ്",
          "result_publishing": "ഫലപ്രസിദ്ധീകരണം",
          "certificate_generation": "സർട്ടിഫിക്കറ്റ് ജനറേഷൻ",
          "volunteer_coordination": "വൊളന്റീയർ സമന്വയം",
          "shift_allocation": "ഷിഫ്റ്റ് നിയോഗം",
          "instructions": "നിർദ്ദേശങ്ങൾ",
          "login": "ലോഗിൻ",
          "logout": "ലോഗ്ഔട്ട്",
          "language": "ഭാഷ",
          "english": "ഇംഗ്ലീഷ്",
          "malayalam": "മലയാളം"
        }
      }
    },
    fallbackLng: 'en',
    detection: {
      order: ['queryString', 'cookie'],
      caches: ['cookie']
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;