using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using ContactList.Models;

namespace ContactList.Controllers
{
    public class ContactController : ApiController
    {
        private DBModel db = new DBModel();

        // GET: api/Contact
        public IQueryable<Contact> GetContact()
        {
            return db.Contact;
        }

        // GET: api/Contact/5
        [ResponseType(typeof(Contact))]
        public IHttpActionResult GetContact(int id)
        {
            Contact contact = db.Contact.Find(id);
            if (contact == null)
            {
                return NotFound();
            }

            return Ok(contact);
        }

        // PUT: api/Contact/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutContact(int id, Contact contact)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != contact.ContactID)
            {
                return BadRequest();
            }

            db.Entry(contact).State = EntityState.Modified;
            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ContactExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Contact
        [ResponseType(typeof(Contact))]
        public IHttpActionResult PostContact(Contact contact)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Contact.Add(contact);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = contact.ContactID }, contact);
        }

        // DELETE: api/Contact/5
        [ResponseType(typeof(Contact))]
        public IHttpActionResult DeleteContact(int id)
        {
            Contact contact = db.Contact.Find(id);
            List<Email> emails = db.Email.Where(o => o.EmailContactID == id).ToList();
            List<MobileNumber> mobileNumbers = db.MobileNumber.Where(o => o.MobileContactID == id).ToList();
            if (contact == null)
            {
                return NotFound();
            }
            if (emails != null)
            {
                for (var i = 0; i < emails.Count; i++)
                {
                    db.Email.Remove(emails[i]);
                }
            }
         
            if(mobileNumbers != null)
            {
                for (var i = 0; i < mobileNumbers.Count; i++)
                {
                    db.MobileNumber.Remove(mobileNumbers[i]);
                }
            }

            db.Contact.Remove(contact);
            db.SaveChanges();

            return Ok(contact);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ContactExists(int id)
        {
            return db.Contact.Count(e => e.ContactID == id) > 0;
        }
    }
}