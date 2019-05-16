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
    public class EmailController : ApiController
    {
        private DBModel db = new DBModel();

        // GET: api/Email
        public IQueryable<Email> GetEmail()
        {
            return db.Email;
        }

        // GET: api/Email/5
        [ResponseType(typeof(List<Email>))]
        public IHttpActionResult GetEmail(int id)
        {
            List<Email> emails = db.Email.Where(o => o.EmailContactID == id).ToList();
            if (emails == null)
            {
                return NotFound();
            }

            return Ok(emails);
        }

        
        // PUT: api/Email/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutEmail(int id, Email email)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != email.EmailID)
            {
                return BadRequest();
            }

            db.Entry(email).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmailExists(id))
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

        // POST: api/Email
        [ResponseType(typeof(Email))]
        public IHttpActionResult PostEmail(Email email)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Email.Add(email);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = email.EmailID }, email);
        }

        // DELETE: api/Email/5
        [ResponseType(typeof(List<Email>))]
        public IHttpActionResult DeleteEmail(int id)
        {
            List<Email> emails = db.Email.Where(o => o.EmailContactID == id).ToList();

            for (var i = 0; i < emails.Count; i++)
            {
                db.Email.Remove(emails[i]);
            }
         
            if (emails == null)
            {
                return NotFound();
            }
            db.SaveChanges();
            return Ok(emails);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool EmailExists(int id)
        {
            return db.Email.Count(e => e.EmailID == id) > 0;
        }
    }
}