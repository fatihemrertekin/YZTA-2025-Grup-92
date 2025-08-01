#!/usr/bin/env python3
"""
GitHub Actions için Scheduler Test Script'i
"""
import asyncio
import sys
import os
from datetime import datetime
import pytz

# Türkiye saati
tz = pytz.timezone('Europe/Istanbul')
current_time = datetime.now(tz)

def run_crawl():
    """RSS tarama testi"""
    try:
        print(f'🕐 RSS Crawl başlatılıyor: {current_time.strftime("%Y-%m-%d %H:%M:%S %Z")}')
        
        sys.path.append(os.getcwd())
        from app.services.scheduler import scheduler_service
        from app.core.database import db_manager
        
        async def run_crawl_async():
            try:
                print('📚 RSS tarama başlatılıyor...')
                db_manager.init_database()
                await scheduler_service.crawl_and_process_news()
                print('✅ RSS tarama tamamlandı')
            except Exception as e:
                print(f'❌ RSS tarama hatası: {e}')
                sys.exit(1)
        
        asyncio.run(run_crawl_async())
        
    except Exception as e:
        print(f'❌ Crawl test hatası: {e}')
        sys.exit(1)

def run_digest():
    """Digest gönderimi testi"""
    try:
        print(f'📧 Digest Send başlatılıyor: {current_time.strftime("%Y-%m-%d %H:%M:%S %Z")}')
        
        sys.path.append(os.getcwd())
        from app.services.scheduler import scheduler_service
        from app.core.database import db_manager
        
        async def run_digest_async():
            try:
                print('📧 Digest gönderimi başlatılıyor...')
                db_manager.init_database()
                await scheduler_service.send_daily_digests()
                print('✅ Digest gönderimi tamamlandı')
            except Exception as e:
                print(f'❌ Digest gönderim hatası: {e}')
                sys.exit(1)
        
        asyncio.run(run_digest_async())
        
    except Exception as e:
        print(f'❌ Digest test hatası: {e}')
        sys.exit(1)

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        job_type = sys.argv[1]
        
        if job_type == "crawl":
            run_crawl()
        elif job_type == "digest":
            run_digest()
        elif job_type == "both":
            print("🔄 Her iki job da çalıştırılıyor...")
            run_crawl()
            print("⏳ 5 saniye bekleniyor...")
            import time
            time.sleep(5)
            run_digest()
        else:
            print(f"❌ Geçersiz job type: {job_type}")
            sys.exit(1)
    else:
        print("❌ Job type belirtilmedi. Kullanım: python test_scheduler.py [crawl|digest|both]")
        sys.exit(1) 