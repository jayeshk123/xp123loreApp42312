//
//  nativeEventsInnerTableViewController.swift
//  TestWV
//
//  Created by earth on 24/07/17.
//  Copyright © 2017 earth. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON
import NVActivityIndicatorView

struct eventStruct {
    let eventImage : String!
    let eventName : String!
    let eventLocation : String!
    let eventTime : String!
    let eventCost : String!
    let eventDesc : String!
}

class nativeEventsInnerTableViewController: UITableViewController,NVActivityIndicatorViewable {
    var arrayOfEventsData = [eventStruct]()
    var URL = "http://34.231.31.72/xplore/index.php"
    override func viewDidLoad() {
        super.viewDidLoad()
        
        Alamofire.request(URL+"/site/Events_list_native").responseJSON { response in
            print("Request: \(String(describing: response.request))")   // original url request
            print("Response: \(String(describing: response.response))") // http url response
            print("Result: \(response.result)")                         // response serialization result
            
            if let json = response.data {
                let data = JSON(data: json)
                print("data \(data.count)")
            }
            
            if let json = response.result.value {
                print("JSON: \(json)") // serialized json response
            }
        }

        // Uncomment the following line to preserve selection between presentations
        // self.clearsSelectionOnViewWillAppear = false

        // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
        // self.navigationItem.rightBarButtonItem = self.editButtonItem()
    }
    //Create a method with a completion handler to get the image data from your url
    func getDataFromUrl(url: URL, completion: @escaping (_ data: Data?, _  response: URLResponse?, _ error: Error?) -> Void) {
        URLSession.shared.dataTask(with: url) {
            (data, response, error) in
            completion(data, response, error)
            }.resume()
    }
    
    //Create a method to download the image (start the task)
    /*func downloadImage(url: URL) {
        print("Download Started")
        getDataFromUrl(url: url) { (data, response, error)  in
            guard let data = data, error == nil else { return }
            print(response?.suggestedFilename ?? url.lastPathComponent)
            print("Download Finished")
            DispatchQueue.main.async() { () -> Void in
                self.imageView.image = UIImage(data: data)
            }
        }
    }*/

    
    func convertToDictionary(text: String) -> [String: Any]? {
        if let data = text.data(using: .utf8) {
            do {
                return try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any]
            } catch {
                print(error.localizedDescription)
            }
        }
        return nil
    }
    
    /*let str = "{\"name\":\"James\"}"
    
    let dict = convertToDictionary(text: str)*/
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    // MARK: - Table view data source

    override func numberOfSections(in tableView: UITableView) -> Int {
        // #warning Incomplete implementation, return the number of sections
        return 1
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // #warning Incomplete implementation, return the number of rows
        return 1
    }
    
    override func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 400
    }

    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
            let cell = Bundle.main.loadNibNamed("nativeEventsTableViewCell", owner: self, options: nil)?.first as! nativeEventsTableViewCell
            //self.tableView.dequeueReusableCell(withIdentifier: "eventsCell", for: indexPath) as! nativeEventsTableViewCell
            
            //Bundle.main.loadNibNamed("nativeEventsTableViewCell", owner: self, options: nil)?.first as! nativeEventsTableViewCell
            
            _ = indexPath.row
            cell.eventTitle.text = "Title"
            cell.eventTitle.textColor = UIColor.white
            cell.eventCost.text = "FREE"
            cell.eventCost.textColor = UIColor.white
            cell.eventCost.backgroundColor = UIColor.black
            cell.eventLocation.text = "India"
            cell.eventLocation.textColor = UIColor.white
            cell.eventLocation.backgroundColor = UIColor.black
            cell.eventDesc.text = "Short Description"
            cell.eventDesc.textColor = UIColor.white
            cell.eventDesc.backgroundColor = UIColor.black
            cell.eventTime.text = "Today at 7pm"
            cell.eventTime.textColor = UIColor.white
            cell.eventTime.backgroundColor = UIColor.black
        
            print("Begin of code")
        
            let imageUrl = NSURL(string: "https://s3.amazonaws.com/retail-safari/1496876297.PAW9.jpg")! as URL
                //cell.eventImage.contentMode = .scaleAspectFit
                //downloadImage(url: imageUrl)
            print("Download Started")
            getDataFromUrl(url: imageUrl) { (data, response, error)  in
                guard let data = data, error == nil else { return }
                print(response?.suggestedFilename ?? imageUrl.lastPathComponent)
                print("Download Finished")
                DispatchQueue.main.async() { () -> Void in
                    cell.eventImage.image = UIImage(data: data)
                }
            }
            print("End of code. The image will continue downloading in the background and it will be loaded when it ends.")
        
            return cell
    }

    /*
    // Override to support conditional editing of the table view.
    override func tableView(_ tableView: UITableView, canEditRowAt indexPath: IndexPath) -> Bool {
        // Return false if you do not want the specified item to be editable.
        return true
    }
    */

    /*
    // Override to support editing the table view.
    override func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCellEditingStyle, forRowAt indexPath: IndexPath) {
        if editingStyle == .delete {
            // Delete the row from the data source
            tableView.deleteRows(at: [indexPath], with: .fade)
        } else if editingStyle == .insert {
            // Create a new instance of the appropriate class, insert it into the array, and add a new row to the table view
        }    
    }
    */

    /*
    // Override to support rearranging the table view.
    override func tableView(_ tableView: UITableView, moveRowAt fromIndexPath: IndexPath, to: IndexPath) {

    }
    */

    /*
    // Override to support conditional rearranging of the table view.
    override func tableView(_ tableView: UITableView, canMoveRowAt indexPath: IndexPath) -> Bool {
        // Return false if you do not want the item to be re-orderable.
        return true
    }
    */

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */
    
    /*extension UIImageView {
        func downloadedFrom(url: URL, contentMode mode: UIViewContentMode = .scaleAspectFit) {
            contentMode = mode
            URLSession.shared.dataTask(with: url) { (data, response, error) in
                guard
                    let httpURLResponse = response as? HTTPURLResponse, httpURLResponse.statusCode == 200,
                    let mimeType = response?.mimeType, mimeType.hasPrefix("image"),
                    let data = data, error == nil,
                    let image = UIImage(data: data)
                    else { return }
                DispatchQueue.main.async() { () -> Void in
                    self.image = image
                }
                }.resume()
        }
        func downloadedFrom(link: String, contentMode mode: UIViewContentMode = .scaleAspectFit) {
            guard let url = URL(string: link) else { return }
            downloadedFrom(url: url, contentMode: mode)
        }
    }*/

}
