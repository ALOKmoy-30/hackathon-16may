# UI Screenshot Audit

<!--
--- OBSERVATIONS FROM LOCALHOST:5174 REFERENCE APP ---

## /login Page
- **Background**: Complete full-screen background color is a very deep, rich oled black `#090909`.
- **Card Style**: Centered premium card with background `#141414`, border `1px solid #222222`, rounded-2xl (16px), and padding `p-8` for a spacious, modern feel.
- **Logo & Headings**: A prominent flame icon `lucide-react` colored `#00ff88` at size 32, perfectly centered. Below is the main title "FireEvac System" in `#f0f0f0` (text-xl, font-semibold) and a clean subtitle in `#888888` (text-sm, margin bottom 8).
- **Input Fields**: Labeled with `#888888` (text-xs, block, margin-bottom 1.5). Fields are `w-full` styled with background `#0f0f0f`, border `1px solid #333333`, rounded-lg, padding `px-4 py-3`, text `#f0f0f0`, and an interactive focus transition mapping to border `#00ff88`.
- **Submit Button**: High-impact, pure black text on `#00ff88` background, `w-full` with font-semibold, padding `py-3`, rounded-lg. Micro-interactions include hover color shift to `#00e67a`, active scaling down to 95% via `active:scale-95`, and smooth transitions.
- **Error Messages**: Subtle but highly visible alert text in danger red `#ff4444` at size `text-xs` under input fields.

## /dashboard Page
- **Layout Grid**: Sophisticated 3-column responsive layout `grid-cols-1 lg:grid-cols-3 gap-5`.
- **Top Section (KPI Row)**: A full-width row with a 4-card grid (`grid-cols-2 md:grid-cols-4`). Each KPI card features a lucide icon at the top in `#00ff88` (size 20), a value in `text-2xl font-bold text-[#f0f0f0]`, and a clean label in `text-sm text-[#888888]`.
- **Sensor Cards Grid**: Occupies the left side (2/3 width on desktop) in a `grid-cols-1 sm:grid-cols-2 gap-4` layout. Features hover scaling/color shifts matching premium cards. Icons are `#00ff88`. Status badges sit beautifully at the bottom-right.
- **Temperature Gauge (Bottom Left)**: Custom SVG circular gauge inside a card. Track is stroke `#222222` with strokeWidth 6. Progress bar changes color dynamically (under 60% is `#00ff88`, 60-80% is `#ffaa00`, above 80% is `#ff4444`). The center text displays the value at `text-4xl font-bold text-[#f0f0f0]`, with an animated transition.
- **Activity Chart (Bottom Right)**: Dark themed Recharts `LineChart` using accent stroke `#00ff88` (strokeWidth 1.5), grid lines in `#222222` with `strokeDasharray="4 4"`, and axis ticks in `#555555` at `fontSize 11`. Includes custom dark-themed tooltips and period selector pills (Day/Week/Month) styling where active pills are `bg-[#00ff88] text-black` and inactive are `bg-[#1e1e1e] text-[#888888]`.

## /sensors Page
- **Table Container**: Encased in the premium dark card (`bg-[#141414] border border-[#222222] rounded-xl`) with `overflow-x-auto`.
- **Table Structure**:
  - `thead`: Deep black background `#0f0f0f` with uppercase, tracking-wide text in `#888888` at `text-xs`.
  - `th`: Spaced beautifully with `px-4 py-3` and font-medium weight.
  - `tbody tr`: Interspersed with bottom borders `border-b border-[#1e1e1e]`, smooth hover transition to background `#1a1a1a`.
  - `td`: Clean typography using `text-sm text-[#f0f0f0]`, spaced `px-4 py-3`.
  - **Danger Rows**: Styled with a solid, left accent indicator `border-l-2 border-[#ff4444]` to instantly highlight critical issues.
- **Filter Bar**: Clean panel above table in background `#0f0f0f` with `rounded-xl p-4 mb-4`. Filter inputs match inputs in the login card (bg `#141414`, border `#222222`, text `#f0f0f0`, focus border `#00ff88`).
- **Slide-Over Panel**: Transitions from the right on selection (`w-full md:w-96`), background in `#141414` with a clean left border of `border-l border-[#222222]`. Covered with an elegant dark overlay backdrop of `bg-black/60`.
- **Slide-Over Chart**: Matching the dashboard's LineChart style.

## /evacuation Page
- **SVG Floor Plan**: Perfect contrast with background.
  - Safe rooms: Filled with deep `#1a1a1a` and stroked with `#333333`.
  - Danger rooms: Highlighted with `#1f0000` fill and stroked with `#ff4444`.
  - Corridor: Clean `#111111` fill and `#222222` stroke.
  - Exits: Emerald-glowing `#0a1f0f` fill and `#00ff88` stroke.
- **Evacuation Paths**: Elegant dashed line with stroke `#00ff88`, width 2, and `strokeDasharray="8 4"`. Includes a smooth, infinite scrolling dash animation to show direction of escape.
- **Sensor Dots**: Custom colors representing live states (normal: `#00ff88`, warning: `#ffaa00`, danger: `#ff4444`).
- **Info Panel**: Placed beside the map on desktop / below on mobile, styled in `#141414` with zone names in `text-lg font-semibold text-[#f0f0f0]` and readings in `#888888`.
- **Floor Tabs**: Styled as a small dark toggle box (`bg-[#0f0f0f] rounded-lg p-1 inline-flex gap-1`), where active floor is `bg-[#141414] text-[#00ff88] rounded-md` and inactive is text color `#888888`.

## /control-panel Page
- **Toggle Switches**: Replaced native checkboxes with premium iOS-style switches:
  - Outer track: `w-11 h-6 rounded-full`, background transits from `#333333` (Off) to `#00ff88` (On).
  - Inner thumb: `w-5 h-5 rounded-full`, shifting from `translate-x-0.5` with `#888888` bg (Off) to `translate-x-5` with `bg-black` (On).
- **Zone Cards**: Clean 2-column grid on mobile / 3-column on desktop. Highlighting Mark Safe (`border-[#00ff88]/30 text-[#00ff88] hover:bg-[#00ff88]/10 text-xs px-3 py-1 rounded-lg`) and Mark Danger (`border-[#ff4444]/30 text-[#ff4444] hover:bg-[#ff4444]/10 text-xs px-3 py-1 rounded-lg`) buttons.
- **Log Console**: Monospaced terminal window in deep black `#050505`, border `#1e1e1e` with max-height of `max-h-72`. Timestamps styled in `#555555`. Text logs colored by status (Normal: `#00ff88`, Warning: `#ffaa00`, Error: `#ff4444`).
- **Threshold Inputs**: Premium input styling matching filter inputs, with labels in `#888888` and units (like °C or PPM) displayed in `#555555`.
- **Telegram Banner**: Color-coded banners based on connection state (Connected is `#0a1f0f` background with `#00ff88` border/text; Not Connected is `#1f0000` background with `#ff4444` border/text).

## /alerts Page
- **Alert Cards**: Left bordered accent card style (`border-l-4 border-[#ff4444]` for danger, `border-l-4 border-[#ffaa00]` for warning, and `opacity-50` when resolved).
- **Acknowledge Button**: Sleek green-bordered button (`border border-[#00ff88]/30 text-[#00ff88] hover:bg-[#00ff88]/10 rounded-lg px-3 py-1 text-xs`).
- **Filter Tabs**: Inline pill menu (`bg-[#0f0f0f] rounded-lg p-1 inline-flex`), with active as `bg-[#141414] text-[#00ff88] rounded-md px-4 py-1.5 text-sm` and inactive as `#888888`.
- **Summary Stats**: 3-column stats cards featuring bold text `#f0f0f0` and uppercase small headers `#888888`.
- **Bar Chart**: styled matching Recharts grid specifications, with green accent bars and dark gridding.
- **Empty State**: Minimalist display centered inside a card with a size 40 `#00ff88` Check Circle icon and description text in `#888888`.
-->
