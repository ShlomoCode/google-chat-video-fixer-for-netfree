export function generateDashboardHTML(data) {
    return `<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>סטטיסטיקות</title>
    <style>
        body { 
            font-family: 'Roboto', 'Segoe UI', Arial, sans-serif; 
            margin: 0; 
            background: #fafafa; 
            direction: rtl;
            padding: 24px;
            color: rgba(0, 0, 0, 0.87);
        }
        
        .container { 
            max-width: 900px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
        }
        
        .header {
            background: #1976d2;
            color: white;
            padding: 24px 32px;
            border-radius: 4px 4px 0 0;
        }
        
        .header h1 {
            margin: 0 0 8px 0;
            font-size: 24px;
            font-weight: 400;
            letter-spacing: 0.25px;
        }
        
        .header p {
            margin: 8px 0 16px 0;
            opacity: 0.9;
            font-size: 14px;
            font-weight: 400;
        }
        
        .time-selector {
            margin-top: 16px;
        }
        
        .time-selector label {
            font-size: 14px;
            font-weight: 500;
            margin-left: 8px;
            opacity: 0.9;
        }
        
        .time-selector select {
            background: white;
            color: #1976d2;
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 4px;
            padding: 8px 12px;
            font-size: 14px;
            margin: 0 4px;
            cursor: pointer;
            transition: box-shadow 0.2s ease;
            min-width: 120px;
        }
        
        .time-selector select:focus {
            outline: none;
            box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
        }
        
        .time-selector select option {
            background: white;
            color: #1976d2;
        }
        
        .content { 
            padding: 32px; 
        }
        
        .stats-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
            gap: 16px; 
            margin-bottom: 24px;
        }
        
        .stat-card { 
            background: white;
            padding: 24px; 
            border-radius: 4px; 
            text-align: center;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
            transition: box-shadow 0.2s ease;
            border-left: 4px solid #1976d2;
        }
        
        .stat-card:hover {
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
        }
        
        .stat-number { 
            font-size: 48px; 
            font-weight: 300; 
            color: #1976d2;
            margin: 8px 0;
            line-height: 1;
        }
        
        .stat-label { 
            color: rgba(0, 0, 0, 0.6); 
            font-size: 14px;
            font-weight: 400;
            line-height: 1.4;
        }
        
        .refresh-section {
            text-align: center;
            padding: 16px;
            border-top: 1px solid rgba(0, 0, 0, 0.12);
        }
        
        .refresh-link {
            color: #1976d2;
            text-decoration: none;
            font-weight: 500;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            padding: 8px 16px;
            border-radius: 4px;
            transition: background-color 0.2s ease;
            display: inline-block;
        }
        
        .refresh-link:hover {
            background-color: rgba(25, 118, 210, 0.04);
        }
        
        .emoji {
            font-size: 18px;
            margin-left: 8px;
        }
        
        @media (max-width: 768px) {
            body {
                padding: 16px;
            }
            
            .stats-grid { 
                grid-template-columns: repeat(2, 1fr);
                gap: 12px; 
            }
            
            .header {
                padding: 20px 24px;
            }
            
            .header h1 {
                font-size: 20px;
            }
            
            .content {
                padding: 24px;
            }
            
            .stat-number {
                font-size: 36px;
            }
            
            .stat-card {
                padding: 20px 16px;
            }
        }
        
        @media (max-width: 480px) {
            .stats-grid { 
                grid-template-columns: 1fr;
            }
            
            .header h1 {
                font-size: 18px;
            }
            
            .stat-number {
                font-size: 32px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1><span class="emoji">📊</span>סטטיסטיקות השימוש</h1>
            <p>
                <span class="emoji">🔒</span>הנתונים אנונימיים לחלוטין - לא נאסף אף פרט מזהה
            </p>
            <div class="time-selector">
                <label for="days">תקופה:</label>
                <select id="days" onchange="changePeriod(this.value)">
                    <option value="7" ${data.selectedDays === 7 ? 'selected' : ''}>שבוע אחרון</option>
                    <option value="30" ${data.selectedDays === 30 ? 'selected' : ''}>חודש אחרון</option>
                    <option value="90" ${data.selectedDays === 90 ? 'selected' : ''}>3 חודשים</option>
                    <option value="365" ${data.selectedDays === 365 ? 'selected' : ''}>שנה</option>
                </select>
            </div>
        </div>
        <div class="content">
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">${data.uniquePlayerLoads}</div>
                    <div class="stat-label"><span class="emoji">👤</span>נגן - משתמשים ייחודיים</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${data.totalPlayerLoads}</div>
                    <div class="stat-label"><span class="emoji">▶️</span>נגן - סה"כ טעינות</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${data.uniqueIframeLoads}</div>
                    <div class="stat-label"><span class="emoji">👤</span>iframe - משתמשים ייחודיים</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${data.totalIframeLoads}</div>
                    <div class="stat-label"><span class="emoji">🎬</span>iframe - סה"כ טעינות</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${data.playerAverage}</div>
                    <div class="stat-label"><span class="emoji">🔢</span>נגן - ממוצע טעינות למשתמש</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${data.iframeAverage}</div>
                    <div class="stat-label"><span class="emoji">🔢</span>iframe - ממוצע טעינות למשתמש</div>
                </div>
            </div>
            
            <div class="refresh-section">
                <a href="javascript:window.location.reload()" class="refresh-link">
                    <span class="emoji">🔄</span>רענון
                </a>
            </div>
        </div>
    </div>

    <script>
        function changePeriod(days) {
            const url = new URL(window.location);
            url.searchParams.set('days', days);
            window.location.href = url.toString();
        }
    </script>
</body>
</html>`;
}