using System;
using System.Collections;
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
    public class MobileNumberController : ApiController
    {
        private DBModel db = new DBModel();

        // GET: api/MobileNumber
        public IQueryable<MobileNumber> GetMobileNumber()
        {
            return db.MobileNumber;
        }

        // GET: api/MobileNumber/5
        [ResponseType(typeof(MobileNumber))]
        public IHttpActionResult GetMobileNumber(int id)
        {
            MobileNumber mobileNumber = db.MobileNumber.Find(id);
            if (mobileNumber == null)
            {
                return NotFound();
            }

            return Ok(mobileNumber);

        }

        // PUT: api/MobileNumber/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutMobileNumber(int id, MobileNumber mobileNumber)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != mobileNumber.MobileID)
            {
                return BadRequest();
            }

            db.Entry(mobileNumber).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MobileNumberExists(id))
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

        // POST: api/MobileNumber
        [ResponseType(typeof(MobileNumber))]
        public IHttpActionResult PostMobileNumber(MobileNumber mobileNumber)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.MobileNumber.Add(mobileNumber);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = mobileNumber.MobileID }, mobileNumber);
        }

        // DELETE: api/MobileNumber/5
        [ResponseType(typeof(List<MobileNumber>))]
        public IHttpActionResult DeleteMobileNumber(int id)
        {
            List<MobileNumber> mobileNumbers = db.MobileNumber.Where(o => o.MobileContactID == id).ToList();
      
            for(var i=0;i<mobileNumbers.Count;i++)
            {
                db.MobileNumber.Remove(mobileNumbers[i]);
            }

            if (mobileNumbers == null)
            {
                return NotFound();
            }

            //db.MobileNumber.Remove(mobileNumber);
            db.SaveChanges();

            return Ok(mobileNumbers);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool MobileNumberExists(int id)
        {
            return db.MobileNumber.Count(e => e.MobileID == id) > 0;
        }
    }
}