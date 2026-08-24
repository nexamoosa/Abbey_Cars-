# GitHub Copilot Build Prompt — Our Fleet, Notifications & Booking Forms (Abbey Cars Admin Portal)

Copy/paste this into GitHub Copilot Chat (or use it as a running spec while working through files).

---

## Context

I'm working on the **Abbey Cars Admin Portal**. Stack: (adjust to match your actual stack — assumed here: Node/Express or PHP backend, **MySQL** database, and a frontend admin dashboard like the one already built with a sidebar: Dashboard, Bookings, Privacy Policies, Terms & Conditions, Our Fleet, Areas, Blogs, Contact Info, Forms, Settings, Help).

The public-facing site shows car cards like this for each vehicle:
- Star rating (e.g. `5.0`, `4.5`)
- Car image
- Car name (e.g. "MERCEDES S CLASS", "BMW 7 SERIES", "Toyota Prius")
- Passenger capacity (e.g. "4 Passenger")
- Hand carries count (e.g. "2 Hand Carries")
- Bags count (e.g. "2 Bags")
- A "Book Now" button

Currently the admin "Our Fleet" page only shows summary stats (Cars Listed, Available, Maintenance) and has **no working image storage, no add/edit form, and no per-car booking form** — this is causing an "images not showing" bug in the admin fleet view.

Build the following features end-to-end: **database schema, backend API, and admin UI**.

---

## 1. Database Schema (MySQL)

Create/adjust these tables:

```sql
-- Vehicles table
CREATE TABLE fleet_vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,          -- e.g. "Mercedes S Class"
    category VARCHAR(50),                -- e.g. Sedan, SUV, Van
    rating DECIMAL(2,1) DEFAULT 5.0,
    passengers INT NOT NULL DEFAULT 4,
    hand_carries INT NOT NULL DEFAULT 2,
    bags INT NOT NULL DEFAULT 2,
    price_per_trip DECIMAL(10,2),
    status ENUM('available','maintenance','trashed') DEFAULT 'available',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL           -- soft delete for "Trash Vehicles"
);

-- Images table — stores metadata; actual files live on disk/CDN in /uploads/fleet-images/
CREATE TABLE fleet_vehicle_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,     -- stored filename on disk
    file_path VARCHAR(500) NOT NULL,     -- e.g. /uploads/fleet-images/mercedes-s-class-1.jpg
    is_primary BOOLEAN DEFAULT FALSE,    -- used as the card thumbnail
    sort_order INT DEFAULT 0,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES fleet_vehicles(id) ON DELETE CASCADE
);

-- Notifications table
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL,           -- e.g. 'new_booking', 'form_submission', 'vehicle_maintenance'
    title VARCHAR(255) NOT NULL,
    message TEXT,
    reference_id INT NULL,               -- e.g. booking_id or vehicle_id this relates to
    reference_type VARCHAR(50) NULL,     -- e.g. 'booking', 'vehicle'
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table (per-car booking form submissions)
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(150),
    customer_phone VARCHAR(30),
    pickup_location VARCHAR(255),
    dropoff_location VARCHAR(255),
    pickup_datetime DATETIME,
    passengers INT,
    notes TEXT,
    status ENUM('pending','confirmed','completed','cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES fleet_vehicles(id)
);
```

> Note: images are stored in a dedicated `/uploads/fleet-images/` folder on disk (or S3/CDN bucket) with only the **path/metadata** in MySQL — never store raw binary blobs in the DB. This fixes the "images not showing" bug, which is almost always caused by either (a) storing a blob with no public URL, or (b) a broken relative path. Make sure the upload handler returns a full public URL and the frontend `<img src>` uses that stored path directly.

---

## 2. Backend API Endpoints

### Fleet / Vehicles
- `GET /api/admin/fleet` — list all vehicles (supports `?status=available|maintenance|trashed`, pagination, search by name)
- `GET /api/admin/fleet/:id` — get single vehicle with its images
- `POST /api/admin/fleet` — create vehicle (multipart form-data: fields + images[])
- `PUT /api/admin/fleet/:id` — edit vehicle (fields + optionally replace/add images)
- `DELETE /api/admin/fleet/:id` — soft delete (sets `deleted_at`, moves to Trash)
- `POST /api/admin/fleet/:id/restore` — restore from trash
- `DELETE /api/admin/fleet/:id/permanent` — permanently delete (and remove image files)
- `POST /api/admin/fleet/:id/images` — upload additional images
- `DELETE /api/admin/fleet/:id/images/:imageId` — remove one image
- `PUT /api/admin/fleet/:id/images/:imageId/primary` — set as primary/thumbnail image
- `GET /api/admin/fleet/most-booked` — returns vehicles ranked by booking count (for the "most booked car" widget)

### Bookings (per car)
- `GET /api/admin/bookings?vehicle_id=` — list bookings, optionally filtered by vehicle
- `POST /api/bookings` — public-facing endpoint the per-car "Book Now" form submits to (creates a booking + triggers a `new_booking` notification)
- `PUT /api/admin/bookings/:id/status` — update booking status

### Notifications
- `GET /api/admin/notifications?filter=all|unread|read` — list notifications, most recent first
- `GET /api/admin/notifications/unread-count` — badge count for the header bell icon
- `PUT /api/admin/notifications/:id/read` — mark one as read
- `PUT /api/admin/notifications/:id/unread` — mark one as unread
- `DELETE /api/admin/notifications/:id` — delete one
- `PUT /api/admin/notifications/bulk-read` — body: `{ ids: [] }` or `{ all: true }`
- `DELETE /api/admin/notifications/bulk-delete` — body: `{ ids: [] }` or `{ all: true }`

### Dashboard
- `GET /api/admin/dashboard/summary` — returns:
  - total bookings (all-time + this month)
  - most popular car (name + booking count)
  - total blog posts count
  - total contact/content form submissions count
  - cars listed / available / maintenance counts

---

## 3. Admin UI — "Our Fleet" Page

Replace the current static stat-cards-only page with:

1. **Top summary cards** (keep existing: Cars Listed, Available, Maintenance) — now driven by live DB counts.
2. **A dropdown/action menu** (button near the page title, e.g. "Manage Fleet ▾") with three options:
   - **Add Vehicle** → opens the Add Vehicle form/modal (see below)
   - **All Vehicles List** → shows the full table/grid of vehicles
   - **Trash Vehicles** → shows soft-deleted vehicles with **Restore** and **Delete Permanently** actions
3. **Vehicle list/grid view**, each row/card showing: primary image thumbnail, name, rating, passengers/hand carries/bags, status badge, and action icons (Edit, View Bookings, Delete).
4. **Add/Edit Vehicle form** with fields matching the public card exactly:
   - Name, Category, Rating, Passengers, Hand Carries, Bags, Price, Status, Description
   - **Image uploader** supporting multiple images, drag-to-reorder, and "set as primary" — this is what populates `fleet_vehicle_images` and fixes the broken-image display bug.
5. **"Most Booked Car"** widget/panel on this page (or as a small chart) pulling from `GET /api/admin/fleet/most-booked`.
6. Each vehicle in the list should have a **"View/Manage Bookings"** link that opens that car's dedicated booking form entry under the **Forms** page in the sidebar (see next section) — i.e. each vehicle gets its own booking form record, filterable by `vehicle_id`.

---

## 4. Admin UI — "Forms" Page Integration

- On the **Forms** page, list one entry per vehicle: "Booking Form — Mercedes S Class", etc.
- Clicking a vehicle's form entry shows all bookings submitted for that specific car (from the `bookings` table filtered by `vehicle_id`), with columns: customer name, contact info, pickup/drop-off, date/time, status, and an action to update status or delete.
- Ensure the public "Book Now" button on each car card links to a form pre-filled/pre-linked with that car's `vehicle_id` so submissions land against the correct vehicle.

---

## 5. Admin UI — Header Notification Bell

- Bell icon in the admin header shows an **unread-count badge** (poll `/api/admin/notifications/unread-count` every ~30s or use websockets/SSE if available).
- Clicking the bell opens a dropdown/panel listing recent notifications (title, message, relative timestamp, read/unread dot).
- Each notification: click to mark as read and navigate to the related record (booking or vehicle).
- Support a **"select mode"** with checkboxes to multi-select notifications, plus buttons: **Mark as Read**, **Mark as Unread**, **Delete Selected**, **Mark All as Read**, **Delete All**.
- New notifications should be created automatically on events: new booking submitted, new contact/content form submitted, vehicle moved to maintenance, etc.

---

## 6. Admin UI — Main Dashboard Updates

Add/update dashboard widgets to show:
- **Total bookings** (with trend, e.g. this week/month)
- **Most popular car** (name + number of bookings)
- **Total blog posts published**
- **Total content/contact form submissions received**
- Keep existing fleet counts (Cars Listed / Available / Maintenance) visible here too, pulling from the same `dashboard/summary` endpoint.

---

## 7. Acceptance Criteria / Definition of Done

- [ ] Vehicle images upload successfully, are saved to disk with metadata in `fleet_vehicle_images`, and render correctly on both the admin Our Fleet page and public site (no broken image bug).
- [ ] Admin can Add, Edit, soft-Delete (Trash), Restore, and permanently Delete vehicles.
- [ ] "Our Fleet" page has a working dropdown: Add Vehicle / All Vehicles List / Trash Vehicles.
- [ ] Each vehicle has its own linked booking form visible under the Forms page, filtered to that vehicle's submissions.
- [ ] Notification bell shows live unread count, supports read/unread toggle, single delete, and bulk read/delete actions, backed by the `notifications` table.
- [ ] Dashboard shows total bookings, most popular car, blog count, and form-submission count, all from live queries — no hardcoded numbers.
- [ ] "Most booked car" is calculated correctly via a `COUNT(bookings.id) GROUP BY vehicle_id ORDER BY count DESC` style query.

---

### Notes for Copilot while generating code
- Use parameterized queries / an ORM to avoid SQL injection on all new endpoints.
- Validate file uploads (type/size) before saving to `/uploads/fleet-images/`.
- Use soft deletes (`deleted_at`) for vehicles so "Trash Vehicles" and "Restore" work correctly.
- Keep API responses consistent (`{ success, data, message }` shape) so the frontend can be wired up predictably.
