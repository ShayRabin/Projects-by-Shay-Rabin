/**
 * מחלקה ליצירת גלרייה
 * @param elemId מקבל את המזהה שבו נשים את הגלרייה
 * @param images שמות של תמונות שיוצגו בגלרייה
 */
class Gallery {
    constructor(elemId, ...images) {
        // שם את שמות התמונות שקיבלנו בתוך המחלקה
        this.images = images;
        // חיבור לאלמנט של הגלרייה (לפי שם המזהה שקיבלנו)
        const galleryElem = document.getElementById(elemId);

        // מייצר אלמנט של תמונה
        this.imgElem = document.createElement('img');
        // נרשם לאירועים שיפעילו את הגלרייה
        // (בלחיצה על העכבר הגלרייה תתקדם)
        this.imgElem.addEventListener('click', () => this.nextImage());
        // (בלחיצה על המקש הימני בעכבר הגלרייה תלך אחורה)
        this.imgElem.addEventListener('contextmenu', ev => {
            // מבטל את הפתיחת התפריט בלחיצה על הלחצן הימני
            ev.preventDefault();
            this.prevImage();
        });

        // מוסיף את התמונה לתוך האלמנט המבוקש
        galleryElem.appendChild(this.imgElem);
        // מפעיל את הגלרייה בפעם הראשונה (ע"מ שתוצג תמונה)
        this.nextImage();
    }

    // האלמנט של התמונה
    imgElem;
    // מערך של כל שמות התמונות
    images = [];
    // מיקום הגלרייה (איזו תמונה להציג)
    currentImage = -1;

    // מעבר לתמונה הבאה
    nextImage() {
        // מקדם את המיקום ב-1
        this.currentImage++;
    
        // אם מיקום התמונה גדול או שווה לאורך המערך, מחזירים את המיקום ל-0 (מתחילים מהתחלה)
        if (this.currentImage >= this.images.length) {
            this.currentImage = 0;
        }
    
        // מחליפים את התמונה בגלרייה לפי המיקום החדש
        this.imgElem.src = `images/${this.images[this.currentImage]}`;
    }

    prevImage() {
        // מפחיתים את המיקום ב-1
        this.currentImage--;
    
        // אם המיקום קטן מ-0 מחזירים את המיקום לסוף המערך (פחות 1)
        if (this.currentImage < 0) {
            this.currentImage = this.images.length - 1;
        }

        // מחליפים את התמונה בגלרייה לפי המיקום החדש
        this.imgElem.src = `images/${this.images[this.currentImage]}`;
    }
}

// יצרנו 2 גלריות באמצעות הקלאס של הגלרייה
const gallery1 = new Gallery("gallery1", "p1.png", "p2.png", "p3.png", "p4.png", "p5.png", "p6.png", "p7.png", "p8.png");
const gallery2 = new Gallery("gallery2", "p9.png", "p10.png", "p11.png", "p12.png", "p13.png", "p14.png", "p15.png", "p16.png", "p17.png");

// פונקציה חיצונית שיודעת להשתמש בגלריות שהוגדרו ולעבור לתמונה הבאה
function nextAll() {
    gallery1.nextImage();
    gallery2.nextImage();
}